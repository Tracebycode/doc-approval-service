import {DocumentParseService} from "../src/services/parser.service";


describe("Document Logic Tests", () => {
    
    test("parses title and content correctly", async () => {
    const text = Buffer.from("My Title\nThis is body");
    const result = await DocumentParseService.ParseDocument(
        text,
        "test.txt"
    );

    expect(result.title).toBe("My Title");
    expect(result.content).toBe("This is body");
});

});
  