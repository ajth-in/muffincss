import { describe, test } from "@jest/globals";
import { postcssPipeline } from "./utils";
const cssnano = require("cssnano");

// TODO: tests for child selector, purge, pseudo selector, multiple classes, etc.
describe("MuffinCSS-PostCSS", () => {
  test("Should transform all media classNames to atomic styles, should not purge media at rules with unprocessed rules", async () => {
    await postcssPipeline(
      "src/tests/atomic-rules/input.test.css",
      "src/tests/atomic-rules/output.test.css",
    );
  });
});
