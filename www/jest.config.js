/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest/presets/js-with-ts-esm", // or other ESM presets
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  testPathIgnorePaterns: ["<rootDir>/cypress/"],
};
