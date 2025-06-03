const _chalk = require("chalk");

type MessageType = "success" | "warning" | "info";

export default function chalk(type: MessageType, message: string): string {
  const muffinPrefix = _chalk.hex("#ff69b4").bold("[🧁muffincss]");

  const styledMessage = {
    success: _chalk.green,
    warning: _chalk.green,
    info: _chalk.green.italic,
  }[type](message);

  return `${muffinPrefix} ${styledMessage}`;
}
