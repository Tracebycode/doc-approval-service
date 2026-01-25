import { PostWorkflowService } from "../src/services/post-workflow.service";
import { PostStatus } from "../src/types/posts";
import { StorageService } from "../src/services/storage.service";
import { EmailService } from "../src/services/email.service";

// ---- MOCKS ----
jest.mock("../src/services/storage.service");
jest.mock("../src/services/email.service");

describe("Post workflow state transitions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("DRAFT → PENDING succeeds and sends email", async () => {
    const post = {
      id: "1",
      status: PostStatus.DRAFT,
      title: "Test",
      content: "Body",
    };

    (StorageService.getPostById as jest.Mock).mockResolvedValue(post);
    (StorageService.updatePost as jest.Mock).mockResolvedValue(undefined);
    (EmailService.sendApproveEmail as jest.Mock).mockResolvedValue(undefined);

    await PostWorkflowService.submitPost("1");

    expect(post.status).toBe(PostStatus.PENDING);
    expect(StorageService.updatePost).toHaveBeenCalled();
    expect(EmailService.sendApproveEmail).toHaveBeenCalled();
  });

  test("submit fails if post is not DRAFT", async () => {
    const post = {
      id: "1",
      status: PostStatus.PENDING,
    };

    (StorageService.getPostById as jest.Mock).mockResolvedValue(post);

    await expect(
      PostWorkflowService.submitPost("1")
    ).rejects.toThrow("INVALID_STATE");
  });

  test("submit fails if post does not exist", async () => {
    (StorageService.getPostById as jest.Mock).mockResolvedValue(undefined);

    await expect(
      PostWorkflowService.submitPost("404")
    ).rejects.toThrow("NOT_FOUND");
  });

  test("email failure prevents silent success", async () => {
    const post = {
      id: "1",
      status: PostStatus.DRAFT,
    };

    (StorageService.getPostById as jest.Mock).mockResolvedValue(post);
    (StorageService.updatePost as jest.Mock).mockResolvedValue(undefined);
    (EmailService.sendApproveEmail as jest.Mock).mockRejectedValue(
      new Error("SMTP_DOWN")
    );

    await expect(
      PostWorkflowService.submitPost("1")
    ).rejects.toThrow();
  });
});
