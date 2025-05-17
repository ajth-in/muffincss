import { Declaration } from "postcss";
import { x86 } from "murmurhash3js";

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
