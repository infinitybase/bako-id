export * from './artifacts';

export const contractsId = {
  testnet: {
    manager:
      '0x640eb8ea070eecf6baada9e15a82a6d44694509ecc6695b18600e6c2aa986ae9',
    registry:
      '0x7c505d0518e6c4740116f0ac84ded72dfdc2574a12050b707d30a63974761149',
    resolver:
      '0x51a9a755377a057018c78f19f7ae331365e3c3415b48927b2fd42aa35dc06653',
    nft: '0xb041330d559994516bd00d3c1ebace8a9695e14382f5db0df61f52fef06f5c48',
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
