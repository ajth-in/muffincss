# @muffincss/postcss

A PostCSS plugin for MuffinCSS, an atomic CSS generator. This plugin processes your CSS files, generates atomic utility classes, and applies configured resets and optimizations.

## Installation

Install the package using npm or yarn:

```bash
npm install @muffincss/postcss postcss
# or
yarn add @muffincss/postcss postcss
```

## Usage

Add `@muffincss/postcss` to your PostCSS configuration. For example, in a `postcss.config.js` file:

```javascript
module.exports = {
  plugins: [
    require('@muffincss/postcss')({
      // options
    })
  ]
};
```

You will also need to include the `@muffincss;` at-rule in your main CSS file to specify where the generated MuffinCSS styles (reset and utilities) should be injected.

```css
/* src/styles/main.css */
@muffincss;

/* Your other global styles or class definitions */
.my-component {
  padding: 1rem;
  border: 1px solid #ccc;
}
```

## Options

The plugin accepts an options object with the following properties:

| Option          | Type                                  | Default         | Description                                                                                                                               |
|-----------------|---------------------------------------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `outDir`        | `string`                              | `'./muffincss'` | Directory to store generated files, such as resolved class maps.                                                                        |
| `prefix`        | `string`                              | `'a-'`          | Prefix to apply to all generated atomic utility class names.                                                                              |
| `optimize`      | `boolean`                             | `true`          | If true, compiles all CSS styles into atomic utility classes.                                                                             |
| `purge`         | `boolean`                             | `true`          | If true, removes all unused CSS styles during the build process. (Note: Actual purge implementation might depend on other tools or setup). |
| `reset`         | `'minimal' \| 'default' \| 'off'`     | `'default'`     | Specifies the CSS reset strategy to apply.                                                                                                |
| `hash`          | `boolean`                             | `true`          | Whether to hash all generated class names for brevity and collision avoidance.                                                            |
| `debug`         | `boolean`                             | `false`         | Enables debug mode, outputting additional logging and diagnostic information.                                                           |
| `exclude`       | `{ selectors: RegExp[], properties: RegExp[] }` | `{ selectors: [], properties: [] }` | List of CSS selectors and properties (as RegExp) to exclude from processing.                                                              |
| `includedFiles` | `string \| string[]`                  | `undefined`     | Glob pattern or array of glob patterns to specify which files the plugin should process. If the processed file's path doesn't match the provided glob(s), the plugin will skip processing for that file. If not provided, the plugin processes all files it encounters. |

### `includedFiles` Examples

**Using a single glob string:**

This configuration will only process CSS files directly within the `src/components` directory.

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('@muffincss/postcss')({
      includedFiles: 'src/components/*.css'
    })
  ]
};
```

**Using an array of glob strings:**

This configuration will process CSS files located anywhere under `src/components` and `src/pages`.

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('@muffincss/postcss')({
      includedFiles: ['src/components/**/*.css', 'src/pages/**/*.css']
    })
  ]
};
```

## How it Works

The `@muffincss/postcss` plugin scans your CSS for class definitions. Based on these definitions and the plugin configuration, it generates atomic utility classes. These utilities, along with a chosen CSS reset, are then injected into your stylesheet where you've placed the `@muffincss;` at-rule.

For example, a CSS rule like:

```css
.my-button {
  background-color: blue;
  padding: 10px;
}
```

Might be transformed into (conceptual example, actual class names depend on hashing and prefix):

```css
/* Generated utilities (simplified) */
.a-bg-blue { background-color: blue; }
.a-p-10 { padding: 10px; }

/* Your original class might be left as is or purged if not used elsewhere, depending on purge strategy */
.my-button {
  /* Original properties might be replaced by atomics or handled by your setup */
}
```
The plugin aims to reduce CSS bundle sizes by promoting the reuse of utility classes.

## Contributing

Contributions are welcome! Please refer to the main project repository for contribution guidelines.

## License

This project is licensed under the MIT License.
