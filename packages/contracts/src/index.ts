export * from './artifacts';

export const contractsId = {
  testnet: {
    manager:
      '0xea29408a7982abef6251661545e4aba186517b7af4c84801e99589493d8dc2f8',
    registry:
      '0x0bb2093d19146b106bb4d3ef2f82afe131911ac16b91ae0761d35960f4e79291',
    resolver:
      '0x141a4b06a11703af7f0384ec3176c723d04a1d9133e38c31a8018417c59552fe',
    nft: '0x893d2a45545e9c7fa3f893b73be7a0da63376bf45be3084f2cd8490dda491278',
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
