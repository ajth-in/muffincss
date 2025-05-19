![NPM Version](https://img.shields.io/npm/v/@muffincss/postcss) ![GitHub License](https://img.shields.io/github/license/ajth-in/muffincss)

<div align="center">

# 🧁 MuffinCSS

_Transform plain CSS into atomic, type-safe utilities — effortlessly._

</div>

## ✨ Features

- ✅ Write styles in plain CSS files and reference them in your code using `muffin-utilities` with full type safety.
- 🧬 Automatic conversion of all styles into atomic CSS for maximum performance and minimal duplication.
- 🎛️ `@cv` at-rule for authoring styles in a **class-variants** pattern — intuitive and scalable.
- 🧩 `@pattern` at-rule for defining and reusing **custom utility patterns** across your project.

## 📚 Documentation

For detailed usage instructions, API reference, and examples, please visit the [official MuffinCSS docs](https://muffincss.ajth.in).

## 🛠️ Installation

Install the PostCSS plugin using your preferred package manager:

```bash
pnpm add @muffincss/postcss
```

Then, add this to your postcss configuration:

```js
// postcss.config.js
module.exports = {
  plugins: {
    "@muffincss/postcss": {
      outDir: "src/muffincss",
    },
  },
};
```

## 🚀 Usage

In your global CSS file, add the following directive:

```css
@muffincss;
```

When using the generated styles in your code, import and use the css function from the generated file (located in the configured outDir, e.g., src/muffincss/css.ts):

```css
import { css } from "@/muffincss/css";

<div className={css(["header", "header-primary"])} />
```

## 📝 License

MIT License © 2025–Present [ajth.in](https://ajth.in)
