import { type AcceptedPlugin, type PluginCreator } from "postcss";

export type PluginOptions = {
  // The base directory to scan for class candidates.
  base?: string;

  // Optimize and minify the output CSS.
  optimize?: boolean | { minify?: boolean };
};

function tailwindcss(opts: PluginOptions = {}): AcceptedPlugin {
  return {
    postcssPlugin: "@atombem/postcss",
    async Once(root, { result }) {
      console.log(root);
    },
  };
}

export default Object.assign(tailwindcss, {
  postcss: true,
}) as PluginCreator<PluginOptions>;
