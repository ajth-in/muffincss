export const cjsTemplate = `
module.exports = {
  mediaClassMap: {{{mediaClassMap}}},
};
`;

export const esmTemplate = `
export const mediaClassMap = {{{mediaClassMap}}};
`;

export const dtsTemplate = `
export type ClassNames= {{{classNames}}};
export declare const mediaClassMap: Record<ClassNames, string[]>;
`;
