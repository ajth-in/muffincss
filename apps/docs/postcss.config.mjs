export default {
  plugins: {
    "@muffincss/postcss": {
      debug: true,
      reset: "default",
      outDir: "src/muffin",
      exclude: {
        selectors: ["dark"],
      },
    },
  },
};
