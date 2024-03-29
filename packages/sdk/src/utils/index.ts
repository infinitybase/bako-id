import { Provider } from 'fuels';

export * from './wallet';
export * from './errors';
export * from './domain';

export const getTxParams = (provider: Provider) => {
  const gasConfig = provider.getGasConfig();
  return {
    gasPrice: 1,
    gasLimit: 1_000_000
  };
};
