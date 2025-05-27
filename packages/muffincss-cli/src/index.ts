import { Command } from "commander";

const program = new Command();

program
  .name("muffin")
  .description("An example CLI built with Commander.js and TypeScript")
  .version("0.0.0");

program
  .command("greet")
  .description("Greet a user")
  .argument("<name>", "Name to greet")
  .option("-u, --uppercase", "Print in uppercase")
  .action((name: string, options: { uppercase?: boolean }) => {
    const message = `Hello, ${name}!`;
    console.log(options.uppercase ? message.toUpperCase() : message);
  });

program.parse(process.argv);
