module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  moduleNameMapper: {
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@workers/(.*)$': '<rootDir>/workers/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@middleware/(.*)$': '<rootDir>/middleware/$1',
    '^@routes/(.*)$': '<rootDir>/routes/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@root/(.*)$': '<rootDir>/$1',
    '^@validation/(.*)$': '<rootDir>/validation/$1'
  }
};
