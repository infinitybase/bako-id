import { extendConfig } from '@shared/tsup';

if (process.env.NODE_ENV !== 'production') {
  import('dotenv/config');
}

export default extendConfig({
  dts: true,
  entry: ['src/index.ts'],
  esbuildOptions: (options) => {
    const apiUrl = process.env.API_URL || '';
    console.log('[SDK] Building with API_URL:', apiUrl);

    options.define = {
      'process.env.API_URL': JSON.stringify(apiUrl),
    };
  },
});
