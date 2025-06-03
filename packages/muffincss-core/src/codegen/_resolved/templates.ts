import type { FileGenType } from "../../types";

export const templates: FileGenType[] = [
  {
    type: "cjs",
    content: `
    "use strict";
    module.exports = {{{json this}}};`,
  },
  {
    type: "esm",
    content: `
    export default {{{json this}}};`,
  },
  {
    type: "dts",
    content: `
declare const obj: Record<
  {{#if keys.length}}
    {{#each keys}}
      "{{cleanKey this}}"{{#unless @last}} | {{/unless}}
    {{/each}}
  {{else}}
    string
  {{/if}},
  string[]
>;
export default obj;`,
  },
];
