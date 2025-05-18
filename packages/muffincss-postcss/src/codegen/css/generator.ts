import path from "path";
import fs from "fs";

import Handlebars from "handlebars";
import { cjsTemplate, dtsTemplate, mjsTemplate } from "./templates";

export function generateCSSModule(outDir: string): void {
  const files = [
    { content: cjsTemplate, name: "index.cjs" },
    { content: mjsTemplate, name: "index.mjs" },
    { content: dtsTemplate, name: "index.d.ts" },
  ];
  const outputDirPath = path.resolve(process.cwd(), outDir);
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  for (const file of files) {
    const compiled = Handlebars.compile(file.content);
    const result = compiled({});

    const outputPath = path.join(outputDirPath, file.name);
    fs.writeFileSync(outputPath, result, "utf-8");
  }
}
