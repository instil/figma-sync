module.exports = {
  resetMocks: true,
  preset: "ts-jest/presets/js-with-ts",
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
  },
  testMatch: ["**/*.test.ts"],
  transformIgnorePatterns: [
    "/node_modules/"
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  }
};
