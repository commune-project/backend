module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^commune-backend/(.*)$': '<rootDir>/src/$1'
  },
  "globalSetup": "<rootDir>/node_modules/@databases/pg-test/jest/globalSetup.js",
  "globalTeardown": "<rootDir>/node_modules/@databases/pg-test/jest/globalTeardown.js",
}