import type { Identity } from '@/types';

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

export const identity = (identity: Identity) => {
  if (identity.Address) {
    return {
      address: identity.Address.bits,
      type: 'address',
    };
  }

  return {
    address: identity.ContractId.bits,
    type: 'contract',
  };
};

export const formatAddress = (address: string, factor?: number) => {
  const size = factor ?? 10;

  if (!address) return;
  return `${address.slice(0, size)}...${address.slice(-1 * (size / 2))}`;
};

export const isIPFS = (url: string) => url.startsWith('ipfs://');

export const isHTTPS = (url: string) => url.startsWith('https://');

export const IPFStoHTTP = (url: string) =>
  isIPFS(url) ? `https://ipfs.io/ipfs/${url.slice(7)}` : url;

export const parseURI = (uri: string) => {
  if (isHTTPS(uri)) return uri;

  if (isIPFS(uri)) return IPFStoHTTP(uri);

  return uri;
};
