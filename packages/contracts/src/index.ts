export * from './artifacts';

export const contractsId = {
  testnet: {
    manager:
      '0x324a2d168efd2e999156812c8edf51df68c110dd5afa4bd5fd83219f2382e3d2',
    registry:
      '0xa5bafba6b74323b212e192cfcb0e023be89bc479c90086a076c14c4ae3d88537',
    resolver:
      '0x83b9f8b31082e8bb79bc511a0a93f74d721b0bb40c19e49732c5877e9c75a833',
  },
  mainnet: {
    manager: '',
    registry: '',
    resolver: '',
  },
  local: {
    manager: '',
    registry: '',
    resolver: '',
  },
};

type NetworkKeys = keyof typeof contractsId;
type ContractKeys<N extends NetworkKeys> = keyof (typeof contractsId)[N];

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

  throw new Error('Network not supported');
};

export const getContractId = <N extends NetworkKeys>(
  provider: string,
  contract: ContractKeys<N>
) => {
  const network = resolveNetwork(provider) as N;
  return contractsId[network]?.[contract];
};
