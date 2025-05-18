export const cjsTemplate = `"use strict"; module.exports = {{{json this}}};`;

export const dtSTemplate = `declare const obj: Record<
  {{#each keys}}
    "{{cleanKey this}}"{{#unless @last}} | {{/unless}}
  {{/each}},
  string[]
>;
export default obj;`;

export const mjsTemplate = `export default {{{json this}}};`;
