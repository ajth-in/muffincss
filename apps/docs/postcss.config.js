module.exports = {
  plugins: {
    "@muffincss/postcss": {
      hash: false,
      debug: true,
      reset: "default",
      outDir: "src/muffincss",
    },
    cssnano: {
      preset: "default",
    },
  },
};
