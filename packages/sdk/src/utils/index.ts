import { Provider } from 'fuels';

export const getTxParams = (provider: Provider) => {
  const gasConfig = provider.getGasConfig();
  return {
    gasPrice: 1,
    gasLimit: 1_000_000
  };
};

export class InvalidDomainError extends Error {
  constructor() {
    super('Invalid domain characters.');
    this.name = 'InvalidDomainError';
  }
}

export class NotFoundBalanceError extends Error {
  constructor() {
    super('Balance not found.');
    this.name = 'NotFoundBalanceError';
  }
}

export const isValidDomain = (domain: string) => /^@?[a-zA-Z0-9_]+$/.test(domain);

export * from './wallet';
export * from './price';
