import type { MuffinConfig } from "../muffincss-core/src/types";

const config: MuffinConfig = {
  reset: "off",
  hash: false,
  debug: true,
  exclude: {
    selectors: ["btn"],
  },
};

export default config;
