const chalk = require("chalk");

type MessageType = "success" | "warning" | "info";

export default function styleMessage(
  type: MessageType,
  message: string,
): string {
  const muffinPrefix = chalk.hex("#ff69b4").bold("[🧁muffincss]");

  const styledMessage = {
    success: chalk.green,
    warning: chalk.green,
    info: chalk.green.italic,
  }[type](message);

  return `${muffinPrefix} ${styledMessage}`;
}
