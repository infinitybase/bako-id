export * from './wallet';
import { Provider } from 'fuels';

const getTxParams = (provider: Provider) => {
  const gasConfig = provider.getGasConfig();
  return {
    gasPrice: 1,
    gasLimit: 1_000_000,
  };
};

class InvalidDomainError extends Error {};

const isValidDomain = (domain: string) => /^@[a-zA-Z0-9]+$|^[a-zA-Z0-9]+$/.test(domain);

export { getTxParams, isValidDomain, InvalidDomainError };
