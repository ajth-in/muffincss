import { AtRule, Declaration, Rule } from "postcss";
import type { AtomicRule } from "./types";
import { x86 } from "murmurhash3js";
import { cjsTemplate, dtsTemplate, esmTemplate } from "./templates";
const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

export const formatToId = (input: string) =>
  input.replace(/[^a-zA-Z0-9]/g, "_");

export const stringifyDeclaration = (
  decl: Declaration,
  prefix: string,
  hash: boolean,
  mediaQueryParam?: string,
): string => {
  const declarationId = `${decl.prop}-${formatToId(decl.value)}`;
  const out = mediaQueryParam
    ? `${declarationId}-${formatToId(mediaQueryParam)}`
    : declarationId;

  const result = hash
    ? `${prefix}${x86.hash32(out).toString(16)}`
    : `${prefix}${out}`;

  return result;
};

export const generateMediaRules = (
  rules: Map<string, AtomicRule>,
  mediaQuery: string,
) => {
  const mediaRule = new AtRule({ name: "media", params: mediaQuery });

  rules.forEach((data, className) => {
    let selector = `.${className}`;

    const newRule = new Rule({ selector });
    newRule.append(new Declaration({ prop: data.prop, value: data.value }));
    mediaRule.append(newRule);
  });
  return mediaRule;
};

export const generateAtomicRule = (className: string, data: AtomicRule) => {
  const selector = `.${className}`;
  const newRule = new Rule({ selector });
  newRule.append(new Declaration({ prop: data.prop, value: data.value }));
  return newRule;
};

export function generateTemplates(outDir: string, data: object) {
  const mediaClassMapString = JSON.stringify(data, null, 2);

  const cjsContent = mustache.render(cjsTemplate, {
    mediaClassMap: mediaClassMapString,
  });
  fs.writeFileSync(path.join(outDir, "index.cjs"), cjsContent);

  const esmContent = mustache.render(esmTemplate, {
    mediaClassMap: mediaClassMapString,
  });
  fs.writeFileSync(path.join(outDir, "index.mjs"), esmContent);

  const dtsContent = mustache.render(dtsTemplate, {
    classNames: Object.keys(data)
      .map((item) => `"${item.slice(1)}"`)
      .join("|"),
  });
  fs.writeFileSync(path.join(outDir, "index.d.ts"), dtsContent);
}
