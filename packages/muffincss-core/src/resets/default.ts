import type { StyleRule } from ".";

const defaultReset: StyleRule[] = [
  {
    selector: "html",
    declarations: {
      "line-height": "1.15",
      "-webkit-text-size-adjust": "100%",
    },
  },
  {
    selector: "body",
    declarations: {
      margin: "0",
    },
  },
  {
    selector: "main",
    declarations: {
      display: "block",
    },
  },
  {
    selector: "h1",
    declarations: {
      "font-size": "2em",
      margin: "0.67em 0",
    },
  },
  {
    selector: "hr",
    declarations: {
      "box-sizing": "content-box",
      height: "0",
      overflow: "visible",
    },
  },
  {
    selector: "pre",
    declarations: {
      "font-family": "monospace, monospace",
      "font-size": "1em",
    },
  },
  {
    selector: "a",
    declarations: {
      "background-color": "transparent",
    },
  },
  {
    selector: "abbr[title]",
    declarations: {
      "border-bottom": "none",
      "text-decoration": "underline dotted",
    },
  },
  {
    selector: "b, strong",
    declarations: {
      "font-weight": "bolder",
    },
  },
  {
    selector: "code, kbd, samp",
    declarations: {
      "font-family": "monospace, monospace",
      "font-size": "1em",
    },
  },
  {
    selector: "small",
    declarations: {
      "font-size": "80%",
    },
  },
  {
    selector: "sub, sup",
    declarations: {
      "font-size": "75%",
      "line-height": "0",
      position: "relative",
      "vertical-align": "baseline",
    },
  },
  {
    selector: "sub",
    declarations: {
      bottom: "-0.25em",
    },
  },
  {
    selector: "sup",
    declarations: {
      top: "-0.5em",
    },
  },
  {
    selector: "img",
    declarations: {
      "border-style": "none",
    },
  },
  {
    selector: "button, input, optgroup, select, textarea",
    declarations: {
      "font-family": "inherit",
      "font-size": "100%",
      "line-height": "1.15",
      margin: "0",
    },
  },
  {
    selector: "button, input",
    declarations: {
      overflow: "visible",
    },
  },
  {
    selector: "button, select",
    declarations: {
      "text-transform": "none",
    },
  },
  {
    selector: 'button, [type="button"], [type="reset"], [type="submit"]',
    declarations: {
      "-webkit-appearance": "button",
    },
  },
  {
    selector:
      'button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner',
    declarations: {
      "border-style": "none",
      padding: "0",
    },
  },
  {
    selector:
      'button:-moz-focusring, [type="button"]:-moz-focusring, [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring',
    declarations: {
      outline: "1px dotted ButtonText",
    },
  },
  {
    selector: "fieldset",
    declarations: {
      padding: "0.35em 0.75em 0.625em",
    },
  },
  {
    selector: "legend",
    declarations: {
      "box-sizing": "border-box",
      color: "inherit",
      display: "table",
      "max-width": "100%",
      padding: "0",
      "white-space": "normal",
    },
  },
  {
    selector: "progress",
    declarations: {
      "vertical-align": "baseline",
    },
  },
  {
    selector: "textarea",
    declarations: {
      overflow: "auto",
    },
  },
  {
    selector: '[type="checkbox"], [type="radio"]',
    declarations: {
      "box-sizing": "border-box",
      padding: "0",
    },
  },
  {
    selector:
      '[type="number"]::-webkit-inner-spin-button, [type="number"]::-webkit-outer-spin-button',
    declarations: {
      height: "auto",
    },
  },
  {
    selector: '[type="search"]',
    declarations: {
      "-webkit-appearance": "textfield",
      "outline-offset": "-2px",
    },
  },
  {
    selector: '[type="search"]::-webkit-search-decoration',
    declarations: {
      "-webkit-appearance": "none",
    },
  },
  {
    selector: "::-webkit-file-upload-button",
    declarations: {
      "-webkit-appearance": "button",
      font: "inherit",
    },
  },
  {
    selector: "details",
    declarations: {
      display: "block",
    },
  },
  {
    selector: "summary",
    declarations: {
      display: "list-item",
    },
  },
  {
    selector: "template",
    declarations: {
      display: "none",
    },
  },
  {
    selector: "[hidden]",
    declarations: {
      display: "none",
    },
  },
];

export default defaultReset;
