const chalk = require("chalk");

type MessageType = "success" | "warning" | "info";

export default function styleMessage(
  type: MessageType,
  message: string,
): string {
  const muffinPrefix = chalk.hex("#ff69b4").bold("🧁muffincss:"); // pink bold on black bg

  const styledMessage = {
    success: chalk.green, // green on black (non-bold)
    warning: chalk.green, // gold/yellow on black (non-bold)
    info: chalk.green.italic, // blue on black (italic only)
  }[type](message);

  return `${muffinPrefix} ${styledMessage}`;
}
