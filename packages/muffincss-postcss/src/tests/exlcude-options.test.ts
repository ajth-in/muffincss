import { postcssPipeline } from "./muffincss.test";

describe("Exclude options", () => {
  test("Should transform all media classNames to atomic styles, should not purge media at rules with unprocessed rules", async () => {
    const result = await postcssPipeline(
      `
      @layer muffin{
        .header:hover {
          color: yellow;
          background-color:red;
        }
        .btn{
            color: red;
        }
    }
      `,
    );

    expect(result).toBe(
      `@layerutilities{.a-color-yellow-hover:hover{color:#ff0}.a-background-color-red-hover:hover{background-color:red}.a-color-red{color:red}}@layermuffin{}`.replace(
        /\s+/g,
        "",
      ),
    );
  });
});
