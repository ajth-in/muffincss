# **AnuCSS** (*AnuCSS* - [ah-noo C-S-S])  
A PostCSS plugin that transforms regular CSS into atomic, reusable utility classes for improved maintainability and efficiency.

### **Features**

- **Atomic Class Generation**: Converts your traditional CSS into atomic utility classes, promoting modular design and reducing code duplication.
- **Shorthand Notations**: Supports shorthand utility classes, allowing for more concise and efficient CSS.
- **Type Support for BEM-Style Classes**: Fully compatible with BEM (Block, Element, Modifier) conventions, ensuring that your class names remain modular and consistent.

### **Installation**

To install AnuCSS, follow the steps below:

1. **Install the PostCSS Plugin**:  
   AnuCSS is a **PostCSS** plugin, and you can easily add it to your build process.
   
```bash
   npm install @anucss/postcss --save-dev
```

2. In your `postcss.config.js` file, include AnuCSS as a plugin:

```javascript
module.exports = {
  plugins: [
    require('@anucss/postcss'),
    // other PostCSS plugins...
  ],
};
```
3. Install IDE extension (Optional but Recommended):

Install AnuCSS Intellisense Extension

This extension will assist with shorthand class suggestions and improve your overall development experience
