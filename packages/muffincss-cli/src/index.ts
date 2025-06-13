import { Command } from "commander";
import postcss from "postcss";
import postcssAtomizer from "@muffincss/postcss"; // Adjust this path
import fs from "fs/promises"; // Using promises for async operations
import path from "path";
const cssnano = require("cssnano");

async function findCssFiles(dir: string) {
  let cssFiles: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      cssFiles = cssFiles.concat(await findCssFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".css")) {
      cssFiles.push(fullPath);
    }
  }
  return cssFiles;
}

import {
  RESOLVED_CLASS_STORE_PATH,
  CSS_OUTPUT_PATH,
} from "@muffincss/core/core/options-manager";
const program = new Command();

program
  .name("muffin")
  .description("MuffinCSS cli tool to generate styles")
  .version("0.0.0");

program
  .command("codegen")
  .option(
    "--gencss <relativePath>",
    "Generate a CSS file at the specified relative output path.",
  )
  .description(`Generate ${RESOLVED_CLASS_STORE_PATH} and ${CSS_OUTPUT_PATH}`)
  .action(async (options: { gencss?: string }) => {
    const currentDir = process.cwd();
    try {
      const cssFiles = await findCssFiles(currentDir);

      if (cssFiles.length === 0) {
        return;
      }

      let combinedCss = "";
      for (const file of cssFiles) {
        const fileContent = await fs.readFile(file, "utf8");
        combinedCss += fileContent + "\n";
      }

      const result = await postcss([postcssAtomizer(), cssnano()]).process(
        combinedCss,
        {
          from: undefined,
        },
      );
      if (!options.gencss) return;
      const absoluteOutputPath = path.resolve(currentDir, options.gencss);

      const outputFile = path.join(absoluteOutputPath, "build.min.css");

      await fs.mkdir(absoluteOutputPath, { recursive: true }); // Create output directory if it doesn't exist
      await fs.writeFile(outputFile, result.css);

      if (result.map) {
        await fs.writeFile(`${outputFile}.map`, result.map.toString());
      }
    } catch (error) {}
  });

program.parse(process.argv);
