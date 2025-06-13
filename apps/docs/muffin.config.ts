import { MuffinConfig } from "@muffincss/core/types";
const config: MuffinConfig = {
  debug: true,
  hash: true,
  reset: "off",
  outDir: "src/_muffin",
  exclude: {
    selectors: ["dark"],
  },
};

export default config;
