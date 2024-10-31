import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testTimeout: 100000,
  testEnvironment: 'node',
  testMatch: ['/**/*.test.ts'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        diagnostics: false,
      },
    ],
  },
};

export default config;
