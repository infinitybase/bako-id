import type { Provider } from 'fuels';

export * from './wallet';
export * from './errors';
export * from './domain';
export * from './tests';

export const getTxParams = (provider: Provider) => {
  const _gasConfig = provider.getGasConfig();
  return {
    gasPrice: 1,
    gasLimit: 1_000_000,
  };
};
