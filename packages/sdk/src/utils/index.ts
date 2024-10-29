import type { Provider } from 'fuels';

export * from './attestation';
export * from './domain';
export * from './errors';
export * from './provider';
export * from './tests';
export * from './wallet';
export * from './types';

export const getTxParams = (provider: Provider) => {
  const _gasConfig = provider.getGasConfig();
  return {
    gasPrice: 1,
    gasLimit: 1_000_000,
  };
};
