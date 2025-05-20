import { extendConfig } from '@shared/tsup';

export default extendConfig({
  dts: true,
  entry: ['src/index.ts', '!scripts/deploy.ts', '!node-only/**/*.ts'],
});
