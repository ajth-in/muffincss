import { type MuffinConfig } from "@muffincss/core/types";

const config: MuffinConfig = {
  reset: "off",
  hash: false,
  debug: true,
  exclude: {
    selectors: ["btn"],
  },
};

export default config;
