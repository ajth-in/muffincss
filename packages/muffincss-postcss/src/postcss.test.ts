import postcss from "postcss";
import myPlugin from "."; // Adjust this path
import { describe, expect, test } from "@jest/globals";
import {
  mediaQueriesWithNonClassStylesInput,
  mediaQueriesWithNonClassStylesOutput,
} from "./tests/media-query-with-non-class-styles";
import {
  styleSheetWithMediaQueryAndSelectorsInput,
  styleSheetWithMediaQueryAndSelectorsOutput,
} from "./tests/classes-with-nonclass-styles";
const cssnano = require("cssnano");

type PluginOptions = Parameters<typeof myPlugin>[0];

export async function postcssPipeline(
  input: string,
  options: PluginOptions = {
    exclude: {
      selectors: [],
      properties: [],
    },
  },
): Promise<string> {
  const result = await postcss([myPlugin(options), cssnano()]).process(input, {
    from: undefined,
  });
  expect(result.warnings()).toHaveLength(0);

  return result.css.replace(/\s+/g, "");
}

// todo tests for child selector, purge, psedo selector, multiple classes .etc
describe("My PostCSS Plugin", () => {
  test("Should transform all media classNames to atomic styles, should not purge media at rules with unprocessed rules  ", async () => {
    const result = await postcssPipeline(mediaQueriesWithNonClassStylesInput);
    expect(result).toBe(mediaQueriesWithNonClassStylesOutput);
  });
  test("Should compile all class selectors to atomic styles, and should not purge non class selector styles  ", async () => {
    const result = await postcssPipeline(
      styleSheetWithMediaQueryAndSelectorsInput,
    );
    console.log(result);

    expect(result).toBe(styleSheetWithMediaQueryAndSelectorsOutput);
  });
});
