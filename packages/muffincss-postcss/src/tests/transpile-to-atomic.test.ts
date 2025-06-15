import { describe, test } from "@jest/globals";
import { postcssPipeline } from "./utils";

describe("Transpile to atomic css", () => {
  test("Should transform all media classNames to atomic styles, should not purge media at rules with unprocessed rules", async () => {
    await postcssPipeline(
      "src/tests/atomic-rules/input.test.css",
      "src/tests/atomic-rules/output.test.css",
    );
  });
});
