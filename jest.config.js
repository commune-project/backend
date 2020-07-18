module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^commune-backend/(.*)$': '<rootDir>/src/$1',
    '^commune-common/(.*)$': '<rootDir>/node_modules/commune-common/$1'
  },
  transformIgnorePatterns: ["/node_modules/(?!commune-.*).+\\.ts$"],
}