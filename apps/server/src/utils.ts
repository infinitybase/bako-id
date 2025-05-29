import type { Identity } from '@/types';
import { Provider } from 'fuels';

export const validateNetwork = (network: string) => {
  const networks: Record<string, { url: string; chainId: number }> = {
    mainnet: {
      url: 'https://mainnet.fuel.network/v1/graphql',
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

export const isIPFS = (url: string) => Boolean(url?.startsWith('ipfs://'));

export const isHTTPS = (url: string) => Boolean(url?.startsWith('https://'));

export const IPFStoHTTP = (url: string) =>
  isIPFS(url) ? `https://ipfs.io/ipfs/${url.slice(7)}` : url;

export const parseURI = (uri: string) => {
  const now = Date.now();

  if (isHTTPS(uri)) return `${uri}?t=${now}`;

  if (isIPFS(uri)) return `${IPFStoHTTP(uri)}?t=${now}`;

  return uri;
};

export enum Networks {
  MAINNET = 'MAINNET',
  TESTNET = 'TESTNET',
}
export type NetworkName = 'MAINNET' | 'TESTNET';

export const resolveNetwork = {
  [Networks.TESTNET]: new Provider('https://testnet.fuel.network/v1/graphql'),
  [Networks.MAINNET]: new Provider('https://mainnet.fuel.network/v1/graphql'),
};

export const fetchMetadata = async (
  uri: string
): Promise<Record<string, string>> => {
  try {
    const response = await fetch(parseURI(uri));
    const json = await response.json();
    return json;
  } catch {
    return {};
  }
};

export const resolverNetworkByChainId = (chainId: number) => {
  switch (chainId) {
    case 9889:
      return Networks.MAINNET;
    case 0:
      return Networks.TESTNET;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

export enum NetworkId {
  MAINNET = 9889,
  TESTNET = 0,
}
