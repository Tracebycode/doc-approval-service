import { DocumentParseService } from "../src/services/parser.service";

describe("Document parser", () => {

  test("parses title and content from txt file", async () => {
    const buffer = Buffer.from("My Title\nThis is content");

    const result = await DocumentParseService.ParseDocument(
      buffer,
      "test.txt"
    );

    expect(result.title).toBe("My Title");
    expect(result.content).toBe("This is content");
  });

  test("parses image reference in first line", async () => {
    const buffer = Buffer.from(
      "https://example.com/img.png\nMy Title\nHello world"
    );

    const result = await DocumentParseService.ParseDocument(
      buffer,
      "test.md"
    );

    expect(result.image).toContain("https://");
    expect(result.title).toBe("My Title");
    expect(result.content).toBe("Hello world");
  });

  test("throws error on empty document", async () => {
    const buffer = Buffer.from("");

    await expect(
      DocumentParseService.ParseDocument(buffer, "test.txt")
    ).rejects.toThrow("Empty document");
  });

  test("throws error on unsupported file type", async () => {
    const buffer = Buffer.from("Hello");

    await expect(
      DocumentParseService.ParseDocument(buffer, "file.exe")
    ).rejects.toThrow("Unsupported file type");
  });
});
