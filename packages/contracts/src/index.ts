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
    manager:
      '0x0d69e157eba419749d3e3427030b76151f2ed980cb4b1f16fff72b13dc56f2f2',
    registry:
      '0xa92340a64bbad2fa902cf6d247c0ba874a51156e9d41c8311c8f25b25cb10c2f',
    resolver:
      '0x3459d07b9ec69f11d029d4a7609c53b11d0bce3132759f1cbd00a9182b1cad85',
  },
  local: {
    manager: '',
    registry: '',
    resolver: '',
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
