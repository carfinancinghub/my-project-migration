module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/',
    '^@controllers/(.*)$': '<rootDir>/controllers/',
    '^@routes/(.*)$': '<rootDir>/routes/',
    '^@utils/(.*)$': '<rootDir>/utils/',
    '^@services/(.*)$': '<rootDir>/services/',
    '^@models/(.*)$': '<rootDir>/models/',
    '^@config/(.*)$': '<rootDir>/config/',
    '^@middleware/(.*)$': '<rootDir>/middleware/',
    '^@socket/(.*)$': '<rootDir>/socket/',
    '^@tests/(.*)$': '<rootDir>/tests/',
    '^@tools/(.*)$': '<rootDir>/tools/',
    '^@ai/(.*)$': '<rootDir>/services/ai/',
    '^@tasks/(.*)$': '<rootDir>/tasks/'
  }
};
