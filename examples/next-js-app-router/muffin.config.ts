import { MuffinConfig } from "@muffincss/postcss/types";
const config: MuffinConfig = {
  debug: true,
  hash: false,
  reset: "default",
  outDir: "src/muffin",
  exclude: {
    selectors: ["dark"],
  },
};

export default config;
