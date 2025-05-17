/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  watchPathIgnorePatterns: ["<rootDir>/muffincss/"],

  extensionsToTreatAsEsm: [".ts"],
  // Removed globals here

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
