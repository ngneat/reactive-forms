const path = require('path');

module.exports = {
  displayName: 'reactive-forms-dist-test',
  rootDir: path.resolve(),
  testMatch: ['<rootDir>/src/**/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      allowSyntheticDefaultImports: true
    }
  }
};
