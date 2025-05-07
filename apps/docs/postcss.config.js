module.exports = {
  plugins: {
    'postcss-import':{},
    "cssnano": {
      preset: 'default',
    },
    "@muffincss/postcss": {
      content:["/Users/u256273/repositories/atombem/apps/docs/src/*.css"]
    },
 
  },
};
