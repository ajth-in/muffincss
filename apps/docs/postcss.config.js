module.exports = {
  plugins: {
    "@muffincss/postcss": {
      hash: true,
      debug: true,
      reset: "default",
      outDir: "src/muffincss",
    },
    cssnano: {
      preset: "default",
    },
  },
};
