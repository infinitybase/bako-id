export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEV = 'dev',
}

const availableNetworks = {
  [NetworkType.MAINNET]: {
    name: 'Ignition',
    url: '',
    chainId: 9889,
    explorer: 'https://app-mainnet.fuel.network/',
  },
  [NetworkType.TESTNET]: {
    name: 'Fuel Sepolia Testnet',
    url: 'https://testnet.fuel.network/v1/graphql',
    chainId: 0,
    explorer: 'https://app-testnet.fuel.network/',
  },
};

export const networkByChainId = Object.fromEntries(
  Object.values(availableNetworks).map((network) => [network.chainId, network]),
);

export const getExplorer = (chainId?: number | null) => {
  const defaultExplorer = availableNetworks[NetworkType.MAINNET].explorer;

  return networkByChainId[chainId!]?.explorer ?? defaultExplorer;
};
