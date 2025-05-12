import type { StyleRule } from ".";

const minimalReset: StyleRule[] = [
  {
    selector: "*, *::before, *::after",
    declarations: { "box-sizing": "border-box" },
  },
  {
    selector: "*",
    declarations: { margin: "0", padding: 0 },
  },
  {
    atRule: {
      name: "media",
      params: "(prefers-reduced-motion: no-preference)",
      rules: [
        {
          selector: "html",
          declarations: { "interpolate-size": "allow-keywords" },
        },
      ],
    },
  },
  {
    selector: "body",
    declarations: {
      "line-height": "1.5",
      "-webkit-font-smoothing": "antialiased",
    },
  },
  {
    selector: "img, picture, video, canvas, svg",
    declarations: {
      display: "block",
      "max-width": "100%",
    },
  },
  {
    selector: "input, button, textarea, select",
    declarations: { font: "inherit" },
  },
  {
    selector: "p, h1, h2, h3, h4, h5, h6",
    declarations: { "overflow-wrap": "break-word" },
  },
  {
    selector: "p",
    declarations: { "text-wrap": "pretty" },
  },
  {
    selector: "h1, h2, h3, h4, h5, h6",
    declarations: { "text-wrap": "balance" },
  },
  {
    selector: "#root, #__next",
    declarations: { isolation: "isolate" },
  },
];

export default minimalReset;
