import path from "path";
import fs from "fs";

import Handlebars from "handlebars";
import { templates } from "./templates";
import BaseGenerator from "../base";
import type { FileType } from "../../types";
import type Options from "../../core/options-manager";
import { CSS_OUTPUT_PATH } from "../../core/options-manager";

export default class CssModuleGenerator extends BaseGenerator {
  constructor(options: Options["options"]) {
    super(templates, options);
  }
  generate(): void {
    for (const file of this.files) {
      const compiled = Handlebars.compile(file.content);
      const result = compiled(this.getContext(file.type));
      const outputDirPath = this.outDirPath(CSS_OUTPUT_PATH);

      const outputPath = path.join(outputDirPath, this.getFileName(file.type));
      fs.writeFileSync(outputPath, result, "utf-8");
    }
  }
  getContext(fileType: FileType) {
    return {};
  }
}
