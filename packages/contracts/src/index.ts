export * from './artifacts';

export const contractsId = {
  testnet: {
    manager:
      '0x60e8f2a6f963ff233bf47696812e5332e199f183b1e3da2c9b79736e608247da',
    registry:
      '0x622a2844f3304678fee0bb3dedf8eed476dac43c99ea41598ba3a990c568d8a9',
    resolver:
      '0x0b58a031ac042f77bbcf4d27dd4cdfe84a90995fa6e6eef486243aa5ccaac677',
    nft: '0xd55d84ab1b83c856472e166df72c88c40f0dd5391d3f9a1ffab0d19e9d3a2435',
  },
  mainnet: {
    manager: '',
    registry: '',
    resolver: '',
    nft: '',
  },
  local: {
    manager: '',
    registry: '',
    resolver: '',
    nft: '',
  },
};

type NetworkKeys = keyof typeof contractsId;
type ContractKeys<N extends NetworkKeys> = keyof (typeof contractsId)[N];

const DEFAULT_NETWORK: NetworkKeys = 'testnet';

const resolveNetwork = (provider: string) => {
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
  contract: ContractKeys<N>
) => {
  const network = resolveNetwork(provider) as N;
  return contractsId[network]?.[contract];
};
