export * from './artifacts';

export const contractsId = {
  testnet: {
    manager:
      '0x19f62931f5ac9898b4001d3bca336536e3f76297004d144a5f9638665c9bf8ff',
    registry:
      '0x468b3f6eebea52e5ecae7e8a297276c15c303ff65e485a5bd851a6a7fa9483a1',
    resolver:
      '0xdd72f78a46a9bc1fd11c0c9d18eb65d26dd9837eb85d0f3f101ac319dfd710da',
    nft: '0xda25f68065ce8259285a9147dc7acedefd17ff196376daffacbcdd21b73e5039',
  },
  mainnet: {
    manager:
      '0x0d69e157eba419749d3e3427030b76151f2ed980cb4b1f16fff72b13dc56f2f2',
    registry:
      '0xa92340a64bbad2fa902cf6d247c0ba874a51156e9d41c8311c8f25b25cb10c2f',
    resolver:
      '0x3459d07b9ec69f11d029d4a7609c53b11d0bce3132759f1cbd00a9182b1cad85',
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
