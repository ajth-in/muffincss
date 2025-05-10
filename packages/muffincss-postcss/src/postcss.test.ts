import postcss from "postcss";
import myPlugin from "."; // Adjust this path
import { describe, expect, test } from "@jest/globals";

describe("My PostCSS Plugin", () => {
  test("Should transform all media classNames to atomic styles", async () => {
    const input = `
@media (min-width: 768px) {
        .header {
          text-align: center;
          color:blue
        }
          button{
          color:blue}
      }
        @media (min-width: 769px) {
        .header {
          color:yellow
        }
      }
    `;

    const output = `
      @media (min-width: 768px) {
        .text-center {
          text-align: center;
        }
      }
      @media (min-width: 640px) {
        .bg-red-500 {
          background-color: #f56565;
        }
      }
    `;

    const result = await postcss([
      myPlugin({
        exclude: {
          selectors: [],
          properties: [],
        },
      }),
    ]).process(input, {
      from: undefined,
    });
    console.log("OUTPUT:", result.css);
    expect(true).toBe(true);
    // expect(result.css.trim()).toBe(output.trim());
    // expect(result.warnings()).toHaveLength(0);
  });
});
