export default {
  plugins: {
    "@muffincss/postcss": {
      debug: true,
      outDir: "src/muffin",
      exclude: {
        selectors: ["dark"],
      },
    },
  },
};
