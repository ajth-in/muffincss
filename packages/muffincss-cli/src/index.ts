import { Command } from "commander";
import {
  RESOLVED_CLASS_STORE_PATH,
  CSS_OUTPUT_PATH,
} from "@muffincss/core/core/options-manager";
const program = new Command();

program
  .name("muffin")
  .description("An example CLI built with Commander.js and TypeScript")
  .version("0.0.0");

program
  .command("codegen")
  .description(`Generate ${RESOLVED_CLASS_STORE_PATH} and ${CSS_OUTPUT_PATH}`)
  .action(async () => {
    // const { options } = await new Options().prepare();
  });

program.parse(process.argv);
