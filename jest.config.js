module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  transform: {
    '\\.ts$': 'ts-jest',
  },
};
