import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { templates } from "./templates";
import type ResolvedClassListCollector from "../../state/resolved-classlist-collector";
import type Options from "../../options-manager";
import { RESOLVED_CLASS_STORE_PATH } from "../../options-manager";
import BaseGenerator from "../base";
import type { FileType } from "../../types";

export default class GenerateResolvedClassListModule extends BaseGenerator {
  constructor(
    private resultCollector: ResolvedClassListCollector,
    options: Options["options"],
  ) {
    super(templates, options);
    Handlebars.registerHelper("json", (context) =>
      JSON.stringify(context, null, 2),
    );
    Handlebars.registerHelper("cleanKey", (key: string) => {
      return key.startsWith(".") ? key.slice(1) : key;
    });
  }

  generate() {
    const outputDirPath = this.outDirPath(RESOLVED_CLASS_STORE_PATH);

    this.ensureDirectoryStructure(outputDirPath);
    for (const file of this.files) {
      const compiled = Handlebars.compile(file.content);
      const result = compiled(this.getContext(file.type)); // Safe context passed
      const outputPath = path.join(outputDirPath, this.getFileName(file.type));
      fs.writeFileSync(outputPath, result, "utf-8");
    }
  }

  getContext(fileType: FileType) {
    const resolvedListContent = this.resultCollector.serialize();
    switch (fileType) {
      case "cjs":
      case "esm":
        return resolvedListContent;
      case "dts":
        return { keys: Object.keys(resolvedListContent) }; // Fixed: wrap in plain object
    }
  }

  ensureDirectoryStructure(outputDirPath: string) {
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }
  }
}
