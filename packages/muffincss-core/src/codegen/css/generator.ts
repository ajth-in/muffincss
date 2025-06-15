import path from "path";
import fs from "fs";

import Handlebars from "handlebars";
import { templates } from "./templates";
import BaseGenerator from "../base";
import type { FileType } from "../../types";
import type Options from "../../options-manager";
import { CSS_OUTPUT_PATH } from "../../options-manager";

export default class CssModuleGenerator extends BaseGenerator {
  constructor(options: Options["options"]) {
    super(templates, options);
  }
  generate(): void {
    for (const file of this.files) {
      try {
        const compiled = Handlebars.compile(file.content);

        const result = compiled(this.getContext(file.type));

        const outputDirPath = this.outDirPath(CSS_OUTPUT_PATH);
        if (!fs.existsSync(outputDirPath)) {
          fs.mkdirSync(outputDirPath, { recursive: true });
          console.log(`Created directory: ${outputDirPath}`);
        }

        const outputPath = path.join(
          outputDirPath,
          this.getFileName(file.type),
        );
        fs.writeFileSync(outputPath, result, "utf-8");
      } catch (error) {
        console.error(`Error processing file ${file.type}:`, error);
      }
    }
  }
  getContext(fileType: FileType) {
    return {};
  }
}
