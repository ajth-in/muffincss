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
  .description("An example CLI built with Commander.js and TypeScript")
  .version("0.0.0");

program
  .command("codegen")
  .description(`Generate ${RESOLVED_CLASS_STORE_PATH} and ${CSS_OUTPUT_PATH}`)
  .action(async () => {
    const currentDir = process.cwd(); // Get the current working directory
    console.log(`🔍 Searching for CSS files in: ${currentDir}`);

    try {
      const cssFiles = await findCssFiles(currentDir);

      if (cssFiles.length === 0) {
        console.log("🤷 No CSS files found.");
        return;
      }

      console.log("📄 Found CSS files:");
      cssFiles.forEach((file) => console.log(`  - ${file}`));

      let combinedCss = "";
      for (const file of cssFiles) {
        const fileContent = await fs.readFile(file, "utf8");
        combinedCss += fileContent + "\n"; // Add a newline between files
        console.log(`  ➕ Added content from: ${file}`);
      }

      console.log(
        "\n🚀 Processing CSS with PostCSS, postcss-atomizer, and cssnano...",
      );

      const result = await postcss([
        postcssAtomizer(), // Ensure options are passed if needed
        cssnano(), // Ensure options are passed if needed
      ]).process(combinedCss, {
        from: undefined, // Or specify a logical "entry" point if that makes sense for your atomizer
        // to: 'output/bundle.css' // You can specify an output file for sourcemaps
      });

      console.log("\n✅ CSS processing complete!");

      // Example: Write the output to a file
      const outputDir = path.join(currentDir, "dist");
      const outputFile = path.join(outputDir, "styles.min.css");

      await fs.mkdir(outputDir, { recursive: true }); // Create output directory if it doesn't exist
      await fs.writeFile(outputFile, result.css);
      console.log(`💾 Processed CSS saved to: ${outputFile}`);

      if (result.map) {
        await fs.writeFile(`${outputFile}.map`, result.map.toString());
        console.log(`🗺️ Source map saved to: ${outputFile}.map`);
      }
    } catch (error) {
      console.error("❌ Error during CSS processing:", error);
    }
  });

program.parse(process.argv);
