export default {
  plugins: {
    "@muffincss/postcss": {
      debug: true,
      reset: "default",
      outDir: "src/_muffin",
      exclude: {
        selectors: ["dark"],
      },
    },
  },
};
