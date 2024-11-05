import { extendConfig } from '@shared/tsup';
import dotenv from 'dotenv';

dotenv.config();

export default extendConfig({
  dts: true,
  entry: ['src/index.ts'],
  external: ['@bako-id/contracts'],
  env: {
    API_URL: process.env.API_URL!,
  },
  esbuildOptions: (options) => {
    options.define = {
      'process.env': JSON.stringify({
        API_URL: process.env.API_URL,
      }),
    };
  },
});
