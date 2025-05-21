import postcss from "postcss";
import myPlugin from ".."; // Adjust this path
import { describe, expect, test } from "@jest/globals";
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
  filePath?: string,
): Promise<string> {
  const result = await postcss([myPlugin(options), cssnano()]).process(input, {
    from: filePath,
  });
  expect(result.warnings()).toHaveLength(0);

  return result.css.replace(/\s+/g, "");
}

// TODO: tests for child selector, purge, pseudo selector, multiple classes, etc.
describe("MuffinCSS-PostCSS", () => {
  test("Should transform all media classNames to atomic styles, should not purge media at rules with unprocessed rules", async () => {
    const result = await postcssPipeline(
      `
        @muffincss;
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
      `,
      {
        hash: false,
        reset: "off",
        debug: true,
      },
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
        @media (min-width: 768px) {
          button {
            color: blue
          }
        }
      `.replace(/\s+/g, ""),
    );
  });

  test("Should compile all class selectors to atomic styles, and should not purge non class selector styles", async () => {
    const result = await postcssPipeline(
      `
        @muffincss;

        .button {
          background-color: red;
          color: blue
        }
        button {
          color: red
        }
      `,
      { hash: false, reset: "off" },
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

        button {
          color: red
        }
      `.replace(/\s+/g, ""),
    );
  });

  describe("includedFiles option", () => {
    const sampleCss = `
      @muffincss;
      .test-class { color: red; }
    `;
    const expectedOutputProcessed = `@layerreset;@layerutilities{.a-color-red{color:red}}`;
    const expectedOutputSkipped = ``; // Or minimal if cssnano still runs

    test("No includedFiles provided: processes the file", async () => {
      const result = await postcssPipeline(sampleCss, { hash: false, reset: "off" }, "src/components/style.css");
      expect(result.replace(/\s+/g, "")).toBe(expectedOutputProcessed);
    });

    test("includedFiles as string (match): processes the file", async () => {
      const result = await postcssPipeline(
        sampleCss,
        { hash: false, reset: "off", includedFiles: "src/**/*.css" },
        "src/components/style.css",
      );
      expect(result.replace(/\s+/g, "")).toBe(expectedOutputProcessed);
    });

    test("includedFiles as string (no match): skips the file", async () => {
      const result = await postcssPipeline(
        sampleCss,
        { hash: false, reset: "off", includedFiles: "src/**/*.css" },
        "vendor/vendor.css",
      );
      // If skipped, our plugin does nothing. cssnano might still process it to an empty string or minimal output.
      // For simplicity, expecting an empty string after our plugin does nothing.
      expect(result.replace(/\s+/g, "")).toBe(expectedOutputSkipped);
    });

    test("includedFiles as array (match): processes the file", async () => {
      const result = await postcssPipeline(
        sampleCss,
        { hash: false, reset: "off", includedFiles: ["src/**/*.css", "styles/*.css"] },
        "styles/main.css",
      );
      expect(result.replace(/\s+/g, "")).toBe(expectedOutputProcessed);
    });

    test("includedFiles as array (no match): skips the file", async () => {
      const result = await postcssPipeline(
        sampleCss,
        { hash: false, reset: "off", includedFiles: ["src/**/*.css", "styles/*.css"] },
        "lib/legacy.css",
      );
      expect(result.replace(/\s+/g, "")).toBe(expectedOutputSkipped);
    });

    test("includedFiles with empty array: skips the file", async () => {
      const result = await postcssPipeline(
        sampleCss,
        { hash: false, reset: "off", includedFiles: [] },
        "src/components/style.css",
      );
      expect(result.replace(/\s+/g, "")).toBe(expectedOutputSkipped);
    });

    test("includedFiles with non-matching pattern: skips the file", async () => {
      const result = await postcssPipeline(
        sampleCss,
        { hash: false, reset: "off", includedFiles: "nothing_matches_this/**/*.css" },
        "src/components/style.css",
      );
      expect(result.replace(/\s+/g, "")).toBe(expectedOutputSkipped);
    });
  });
});
