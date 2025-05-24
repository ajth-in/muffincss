import { Result, Node } from "postcss";

interface MessageOptions {
  node?: Node;
  word?: string;
  index?: number;
}

export class PostCSSErrorCollector {
  private result: Result;
  private pluginName: string;

  constructor(result: Result, pluginName: string = "@muffincss/postcss") {
    this.result = result;
    this.pluginName = pluginName;
  }

  error(message: string, options: MessageOptions = {}): void {
    if (options.node) {
      throw options.node.error(message, {
        plugin: this.pluginName,
        word: options.word,
        index: options.index,
      });
    } else {
      const error = new Error(message);
      error.name = "CssSyntaxError";
      throw error;
    }
  }

  warn(message: string, options: MessageOptions = {}): void {
    this.result.warn(message, {
      node: options.node,
      plugin: this.pluginName,
      word: options.word,
      index: options.index,
    });
  }

  info(message: string, options: MessageOptions = {}): void {
    this.result.messages.push({
      type: "info",
      plugin: this.pluginName,
      text: message,
      node: options.node,
    });
  }
}
