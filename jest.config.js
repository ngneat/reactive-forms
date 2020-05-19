module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  cacheDirectory: '<rootDir>/.cache',
  testMatch: ['<rootDir>/projects/ngneat/reactive-forms/**/*.spec.ts'],
  testPathIgnorePatterns: ['node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  collectCoverage: true,
  modulePathIgnorePatterns: ['mocks.spec.ts']
};
