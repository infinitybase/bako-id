import contracts from './artifacts/contracts-fuel.json';

export type NetworkKeys = keyof typeof contracts;
export type Contracts = 'manager' | 'registry' | 'resolver' | 'nft';

const DEFAULT_NETWORK: NetworkKeys = 'testnet';

export const resolveNetwork = (provider: string) => {
  if (provider.includes('testnet')) {
    return 'testnet';
  }

  if (provider.includes('mainnet')) {
    return 'mainnet';
  }

  if (provider.includes('localhost') || provider.includes('127.0.0.1')) {
    return 'local';
  }

  return DEFAULT_NETWORK;
};

export const getContractId = <N extends NetworkKeys>(
  provider: string,
  contract: Contracts
) => {
  const network = resolveNetwork(provider) as N;
  return contracts[network]?.[contract];
};

export const contractsId = contracts;

export * from './artifacts';
