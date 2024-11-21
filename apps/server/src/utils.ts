export const validateNetwork = (network: string) => {
  const networks: Record<string, { url: string; chainId: number }> = {
    mainnet: {
      url: 'https://app-mainnet.fuel.network/',
      chainId: 9889,
    },
    testnet: {
      url: 'https://testnet.fuel.network/v1/graphql',
      chainId: 0,
    },
    local: {
      url: 'http://localhost:4000/v1/graphql',
      chainId: 0,
    },
  };

  const networkChainId = networks[network.toLowerCase()];

  if (networkChainId === undefined) {
    throw new Error(
      `Invalid network ${network}, expected one of ${Object.keys(networks).join(', ')}`
    );
  }

  return networkChainId;
};
