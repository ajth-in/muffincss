import path from "path";
import type Options from "../options-manager";
import type { FileGenType, FileType } from "../types";

export default abstract class BaseGenerator {
  protected files: FileGenType[];
  options: Options["options"];
  constructor(files: FileGenType[], options: Options["options"]) {
    this.files = files;
    this.options = options;
  }

  abstract generate(): void;
  abstract getContext(fileType: FileType): any;

  outDirPath(dirName: string) {
    const resolvedOutDirPath = path.join(this.options.outDir, dirName);
    const outputDirPath = path.resolve(process.cwd(), resolvedOutDirPath);
    return outputDirPath;
  }
  getFileName(fileType: FileType) {
    switch (fileType) {
      case "cjs":
        return "index.cjs";
      case "esm":
        return "index.mjs";
      case "dts":
        return "index.d.ts";
    }
  }
}
