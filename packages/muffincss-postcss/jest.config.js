/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",

  watchPathIgnorePatterns: ["<rootDir>/muffincss/"],
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
};
