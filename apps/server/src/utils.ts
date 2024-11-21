export const validateNetwork = (network: string) => {
  const networks: Record<string, { url: string; chainId: number }> = {
    mainnet: {
      url: '',
      chainId: 9889,
    },
    testnet: {
      url: '',
      chainId: 0,
    },
    local: {
      url: '',
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
