module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/index.ts',
  ],
  setupFiles: ['dotenv/config'],
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
