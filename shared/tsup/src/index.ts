import mergeWith from 'lodash.mergewith';
import type { Options } from 'tsup';

export const defaultConfig: Options = {
  dts: false,
  clean: true,
  minify: false,
  sourcemap: true,
  splitting: false,
  format: ['cjs', 'esm', 'iife'],
};

export const extendConfig = (config: Options): Options =>
  mergeWith({}, defaultConfig, config, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
