// import { submitPost } from "../src/services/storage.service";
// import { PostStatus } from "../src/types/posts";

// describe("Post status transitions", () => {
//   test("draft can move to pending", () => {
//     const post = { status: PostStatus.DRAFT };

//     DocumentParseService.ParseDocument(post);

//     expect(post.status).toBe(PostStatus.PENDING);
//   });

//   test("pending cannot be submitted again", () => {
//     const post = { status: PostStatus.PENDING };

//     expect(() => submitPost(post)).toThrow(
//       "Only draft posts can be submitted"
//     );
//   });
// });
