import postcss from "postcss";
import myPlugin from ".."; // Adjust this path
import { describe, expect, test } from "@jest/globals";
const cssnano = require("cssnano");

export async function postcssPipeline(input: string): Promise<string> {
  const result = await postcss([myPlugin(), cssnano()]).process(input, {
    from: undefined,
  });
  expect(result.warnings()).toHaveLength(0);

  return result.css.replace(/\s+/g, "");
}

// TODO: tests for child selector, purge, pseudo selector, multiple classes, etc.
describe("MuffinCSS-PostCSS", () => {
  test("Should transform all media classNames to atomic styles, should not purge media at rules with unprocessed rules", async () => {
    const result = await postcssPipeline(
      `
            @layer muffin{
        .header:hover {
          color: yellow;
        }
        @media (min-width: 768px) {
          .header:hover {
            text-align: center;
            color: blue;
          }
          button {
            color: blue;
          }
        }
    }
      `,
    );

    expect(result).toBe(
      ` @layer reset;
        @layer utilities {
          @media (min-width: 768px) {
            .a-text-align-center-_min_width__768px_-hover:hover {
              text-align: center
            }
            .a-color-blue-_min_width__768px_-hover:hover {
              color: blue
            }
          }
          .a-color-yellow-hover:hover {
            color: #ff0
          }
        }
          @layer muffin {
        @media (min-width: 768px) {
          button {
            color: blue
          }
        }
    }
      `.replace(/\s+/g, ""),
    );
  });

  test("Should compile all class selectors to atomic styles, and should not purge non class selector styles", async () => {
    const result = await postcssPipeline(
      `
      @layer muffin{
        .button {
          background-color: red;
          color: blue
        }
        button {
          color: red
        }
    }
      `,
    );

    expect(result).toBe(
      `
       @layer reset;
        @layer utilities {
          .a-background-color-red {
            background-color: red
          }
          .a-color-blue {
            color: blue
          }
        }
        @layer muffin{
        button {
          color: red
        }
    }
      `.replace(/\s+/g, ""),
    );
  });
});
