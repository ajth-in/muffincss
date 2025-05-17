import path from "path";
import fs from "fs";

import Handlebars from "handlebars";

export function generateCSSModule(outDir: string): void {
  const files = ["index.cjs", "index.mjs", "index.d.ts"];

  const outputDirPath = path.resolve(process.cwd(), outDir);
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  for (const file of files) {
    const templatePath = path.resolve(__dirname, `./${file}.hbs`);
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiled = Handlebars.compile(templateSource);
    const result = compiled({});

    const outputPath = path.join(outputDirPath, file);
    fs.writeFileSync(outputPath, result, "utf-8");
  }
}
