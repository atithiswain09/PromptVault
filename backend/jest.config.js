// jest.config.js
module.exports = {
  testEnvironment: "node", // Specifies a Node.js environment for tests
  testMatch: [
    "**/__tests__/**/*.js", // Matches files in __tests__ subdirectories
    "**/?(*.)+(spec|test).js", // Matches .spec.js or .test.js files
  ],
  setupFilesAfterEnv: ["./jest.setup.js"], // Optional setup file to run before tests
  moduleFileExtensions: ["js", "json", "node"],
};
