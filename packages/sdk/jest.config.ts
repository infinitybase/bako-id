import type { JestConfigWithTsJest } from 'ts-jest';
import * as dotenv from 'dotenv';

dotenv.config();

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
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
