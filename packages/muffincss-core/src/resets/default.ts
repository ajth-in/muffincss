import type { StyleRule } from ".";
const defaultReset: StyleRule[] = [
  {
    selector: "*, ::after, ::before, ::backdrop, ::file-selector-button",
    declarations: {
      "box-sizing": "border-box",
      margin: "0",
      padding: "0",
      border: "0 solid",
    },
  },
  {
    selector: "html, :host",
    declarations: {
      "line-height": "1.5",
      "-webkit-text-size-adjust": "100%",
      "tab-size": "4",
      "font-family":
        "var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji')",
      "font-feature-settings": "var(--default-font-feature-settings, normal)",
      "font-variation-settings":
        "var(--default-font-variation-settings, normal)",
      "-webkit-tap-highlight-color": "transparent",
    },
  },
  {
    selector: "hr",
    declarations: {
      height: "0",
      color: "inherit",
      "border-top-width": "1px",
    },
  },
  {
    selector: "abbr:where([title])",
    declarations: {
      "-webkit-text-decoration": "underline dotted",
      "text-decoration": "underline dotted",
    },
  },
  {
    selector: "h1, h2, h3, h4, h5, h6",
    declarations: {
      "font-size": "inherit",
      "font-weight": "inherit",
    },
  },
  {
    selector: "a",
    declarations: {
      color: "inherit",
      "-webkit-text-decoration": "inherit",
      "text-decoration": "inherit",
    },
  },
  {
    selector: "b, strong",
    declarations: {
      "font-weight": "bolder",
    },
  },
  {
    selector: "code, kbd, samp, pre",
    declarations: {
      "font-family":
        "var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace)",
      "font-feature-settings":
        "var(--default-mono-font-feature-settings, normal)",
      "font-variation-settings":
        "var(--default-mono-font-variation-settings, normal)",
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
    selector: "table",
    declarations: {
      "text-indent": "0",
      "border-color": "inherit",
      "border-collapse": "collapse",
    },
  },
  {
    selector: ":-moz-focusring",
    declarations: {
      outline: "auto",
    },
  },
  {
    selector: "progress",
    declarations: {
      "vertical-align": "baseline",
    },
  },
  {
    selector: "summary",
    declarations: {
      display: "list-item",
    },
  },
  {
    selector: "ol, ul, menu",
    declarations: {
      "list-style": "none",
    },
  },
  {
    selector: "img, svg, video, canvas, audio, iframe, embed, object",
    declarations: {
      display: "block",
      "vertical-align": "middle",
    },
  },
  {
    selector: "img, video",
    declarations: {
      "max-width": "100%",
      height: "auto",
    },
  },
  {
    selector:
      "button, input, select, optgroup, textarea, ::file-selector-button",
    declarations: {
      font: "inherit",
      "font-feature-settings": "inherit",
      "font-variation-settings": "inherit",
      "letter-spacing": "inherit",
      color: "inherit",
      "border-radius": "0",
      "background-color": "transparent",
      opacity: "1",
    },
  },
  {
    selector: ":where(select:is([multiple], [size])) optgroup",
    declarations: {
      "font-weight": "bolder",
    },
  },
  {
    selector: ":where(select:is([multiple], [size])) optgroup option",
    declarations: {
      "padding-inline-start": "20px",
    },
  },
  {
    selector: "::file-selector-button",
    declarations: {
      "margin-inline-end": "4px",
    },
  },
  {
    selector: "::placeholder",
    declarations: {
      opacity: "1",
    },
  },
  {
    atRule: {
      name: "supports",
      params:
        "(not (-webkit-appearance: -apple-pay-button)) or (contain-intrinsic-size: 1px)",
      rules: [
        {
          selector: "::placeholder",
          declarations: {
            color: "color-mix(in oklab, currentcolor 50%, transparent)",
          },
        },
      ],
    },
  },
  {
    selector: "textarea",
    declarations: {
      resize: "vertical",
    },
  },
  {
    selector: "::-webkit-search-decoration",
    declarations: {
      "-webkit-appearance": "none",
    },
  },
  {
    selector: "::-webkit-date-and-time-value",
    declarations: {
      "min-height": "1lh",
      "text-align": "inherit",
    },
  },
  {
    selector: "::-webkit-datetime-edit",
    declarations: {
      display: "inline-flex",
    },
  },
  {
    selector: "::-webkit-datetime-edit-fields-wrapper",
    declarations: {
      padding: "0",
    },
  },
  {
    selector:
      "::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field",
    declarations: {
      "padding-block": "0",
    },
  },
  {
    selector: ":-moz-ui-invalid",
    declarations: {
      "box-shadow": "none",
    },
  },
  {
    selector:
      "button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-button",
    declarations: {
      appearance: "button",
    },
  },
  {
    selector: "::-webkit-inner-spin-button, ::-webkit-outer-spin-button",
    declarations: {
      height: "auto",
    },
  },
  {
    selector: "[hidden]:where(:not([hidden='until-found']))",
    declarations: {
      display: "none !important",
    },
  },
];

export default defaultReset;
