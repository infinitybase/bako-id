import {defineConfig} from 'tsup';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  sourcemap: true,
  shims: true,
  treeshake: true,
  env: {
    STORAGE_ID: process.env.STORAGE_ID!,
    PROVIDER_URL: process.env.PROVIDER_URL!,
  },
  format: ['cjs', 'esm'],
  minify: true,
  entry: ['./src/index.ts'],
  dts: true,
  replaceNodeEnv: true,
});


