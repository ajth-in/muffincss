![NPM Version](https://img.shields.io/npm/v/@muffincss/postcss) ![GitHub License](https://img.shields.io/github/license/ajth-in/muffincss)

<div align="center">

# 🧁 MuffinCSS

_Transform plain CSS into atomic, type-safe utilities — effortlessly._

</div>

## ✨ Features

- **Atomic CSS Generation**: Automatically converts your standard CSS into highly reusable, single-purpose atomic classes.
- **Type-Safe Utilities**: Generates TypeScript definitions for all your class names, ensuring type safety and autocompletion in your projects.
- **Seamless Integration**: Works as a PostCSS plugin or a standalone CLI, fitting perfectly into your existing build process.
- **Zero Configuration**: Sensible defaults allow you to get started quickly, with powerful configuration options available when you need them.
- **CSS Reset**: Includes optional modern CSS resets (`minimal` or `default`) to ensure cross-browser consistency.
- **Highly Configurable**: Customize class name prefixes, enable/disable class hashing, exclude specific selectors, and more.
- **Optimized Output**: Purges unused CSS and minifies the output for the smallest possible production bundle.

## 🛠️ Getting Started

Install the PostCSS plugin and CLI using your preferred package manager:

**pnpm**
---bash---
pnpm add @muffincss/postcss @muffincss/cli -D

---

**npm**
---bash---
npm install @muffincss/postcss @muffincss/cli --save-dev

---

**yarn**
---bash---
yarn add @muffincss/postcss @muffincss/cli --dev

---

Next, create a configuration file at the root of your project. MuffinCSS supports `muffin.config.ts`, `muffin.config.js`, or `muffin.config.json`.

**`muffin.config.ts`**
---ts---
import { type MuffinConfig } from "@muffincss/core/types";

const config: MuffinConfig = {
reset: "off",
hash: false,
debug: true,
exclude: {
selectors: ["btn"],
},
};

## export default config;

**`muffin.config.js`** (ESM)

```js
/** @type {import('@muffincss/core/types').MuffinConfig} */
const config = {
  reset: "off",
  hash: false,
  debug: true,
  exclude: {
    selectors: ["btn"],
  },
};

export default config;
```

**`muffin.config.js`** (CJS)

```js
/** @type {import('@muffincss/core/types').MuffinConfig} */
const config = {
  reset: "off",
  hash: false,
  debug: true,
  exclude: {
    selectors: ["btn"],
  },
};

module.exports = config;
```

**`muffin.config.json`**

```json
{
  "reset": "off",
  "hash": false,
  "debug": true,
  "exclude": {
    "selectors": ["btn"]
  }
}
```

A full list of configuration options is available [below](#-configuration).

You can run MuffinCSS in two ways:

#### Option 1: With PostCSS

Add MuffinCSS to your PostCSS configuration. This will automatically transform your CSS and generate a `muffincss` directory in your project root.

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    "@muffincss/postcss": {},
  },
};
```

#### Option 2: With the CLI

Use the CLI to generate the `muffincss` directory and optionally create a minified CSS bundle. See the [CLI Documentation](#-cli) for more details.

```bash
npx muffin codegen --gencss <path>
```

This will create a minified `build.min.css` file in the specified path.

## 🚀 Usage

To designate which CSS rules should be atomized, wrap them in the `@layer muffin` at-rule in your CSS files.

**`globals.css`**

```css
@layer muffin {
  .btn {
    padding: 0.5rem 1rem;
    background-color: rebeccapurple;
    color: white;
    border-radius: 0.25rem;
  }

  .btn:hover {
    background-color: darkslateblue;
  }
}
```

Import the CSS file into your application's entry point. Then, use the generated `css` utility from the `muffincss` directory to apply styles with full type safety.

**`Component.jsx`**

```jsx
import "globals.css";
import css from "@/muffincss/css";

function MyComponent() {
  return <button className={css(["btn"])}>Click Me</button>;
}
```

## ⚙️ Configuration

You can configure MuffinCSS by creating a `muffin.config.js`, `muffin.config.ts`, or `muffin.config.json` file in your project's root directory.

| Option     | Type                                  | Description                                                                                              | Default       |
| :--------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------- | :------------ |
| `outDir`   | `string`                              | Directory to store the generated styled system.                                                          | `'muffincss'` |
| `optimize` | `boolean`                             | If `true`, compiles all CSS styles into atomic utility classes.                                          | `true`        |
| `purge`    | `boolean`                             | If `true`, removes all unused CSS styles during the build process.                                       | `true`        |
| `reset`    | `'minimal'` \| `'default'` \| `'off'` | Specifies the CSS reset strategy. `"minimal"` or `"default"` applies a reset, while `"off"` disables it. | `'default'`   |
| `prefix`   | `string`                              | Prefix to apply to all generated utility class names.                                                    | `'a-'`        |
| `exclude`  | `{ selectors?: string[] }`            | An object containing arrays of CSS selectors to exclude from processing.                                 | `undefined`   |
| `hash`     | `boolean`                             | If `true`, all generated class names will be hashed to a short, unique string.                           | `true`        |
| `debug`    | `boolean`                             | If `true`, the plugin outputs additional logging and diagnostic information.                             | `false`       |

## CLI

MuffinCSS provides a command-line interface for generating styles.

---

Usage: muffin [command]

MuffinCSS cli tool to generate styles

Commands:
codegen Generate muffincss directory and CSS output file

---

### `codegen`

This command finds all `.css` files in the current directory and its subdirectories, processes them with MuffinCSS, and generates the core type-safe utilities in the `muffincss` directory.

#### Options

| Option                    | Argument         | Description                                                                       |
| :------------------------ | :--------------- | :-------------------------------------------------------------------------------- |
| `--gencss <relativePath>` | `<relativePath>` | Generates a single, minified `build.min.css` file at the specified relative path. |

## 📝 License

MIT License © 2025–Present [ajth.in](https://ajth.in)
