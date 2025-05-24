import type { Root } from "postcss";
import BaseProcessor from "./base";
import type { Instrumentation } from "../core/instrumentation";
import type { PostCSSErrorCollector } from "../core/error-handler";
import type ResolvedClassListCollector from "../core/resolved-classlist-collector";
import type Options from "../core/options-manager";

export default class AtRuleProcessor extends BaseProcessor {
  constructor(
    instrumentation: Instrumentation,
    errorHandler: PostCSSErrorCollector,
    resultCollector: ResolvedClassListCollector,
    options: Options["options"],
  ) {
    super(instrumentation, errorHandler, resultCollector, options);
  }
  walk(root: Root): void {
    this.instrumentation;
    throw new Error("Method not implemented.");
  }
}
