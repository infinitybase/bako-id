import { extendConfig } from '@shared/tsup';

export default extendConfig({
  dts: true,
  entry: ['src/index.ts'],
  external: ['@bako-id/contracts'],
});
