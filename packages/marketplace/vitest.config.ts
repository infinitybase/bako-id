import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

dotenv.config();

export default defineConfig({
  test: {
    // Set the test environment to 'node'
    environment: 'node',

    // Specify the test files to include. This replaces Jest's "testMatch"
    include: ['**/*.test.ts'],

    // If needed, you can add further configurations, such as global options or coverage settings.
    // For example:
    // globals: true,
    // coverage: { reporter: ['text', 'lcov'] },
  },
});
