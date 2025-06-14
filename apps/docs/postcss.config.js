/**
 * @type {import('postcss-load-config').Config}
 *
 */
module.exports = {
  plugins: [

    'autoprefixer',
    ['@muffincss/postcss', {}],
    /**
     * cssnano is used for CSS minification.
     * It's a best practice to run minification plugins last.
     * We also configure it to run ONLY in production builds to ensure
     * that development server reloads remain fast.
     */
    process.env.NODE_ENV === 'production'
      ? ['cssnano', { preset: 'default' }]
      : null,
  ].filter(Boolean), // The .filter(Boolean) safely removes any 'null' plugins from the array.
};
