import { Address } from 'fuels';

const UI_URL = 'https://bako.id';

const { API_URL } = process.env;

export enum Networks {
  MAINNET = 9889,
  TESTNET = 0,
}

export type IDRecord = {
  name: string;
  owner: string;
  resolver: string;
  nameHash: string;
  timestamp: string;
  period: number;
  type?: string;
};

export type OffChainData = {
  resolversName: Record<string, string>;
  resolversAddress: Record<string, string>;
  records: Record<string, IDRecord[]>;
};

export type RegisterInput = {
  owner: string;
  domain: string;
  period: number;
  resolver: string;
  transactionId: string;
};

export type ChangeAddressInput = {
  domain: string;
  address: string;
  transactionId: string;
};

export type NetworkName = 'MAINNET' | 'TESTNET';

const resolveNetwork = (chainId: number): NetworkName => {
  switch (chainId) {
    case Networks.MAINNET:
      return 'MAINNET';
    case Networks.TESTNET:
      return 'TESTNET';
    default:
      return 'MAINNET';
  }
};

type HTTPClient = ReturnType<typeof httpClient>;
type HTTPClientConfig = {
  url: string;
};

const httpClient = (config: HTTPClientConfig) => {
  const apiUrl = `${config.url}`;
  return {
    get: async <R>(network: string, endpoint: string) =>
      fetch(`${apiUrl}/${network}${endpoint}`).then(
        (res) => res.json() as Promise<R>
      ),
    post: async <T>(network: string, endpoint: string, body: T) =>
      fetch(`${apiUrl}/${network}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((res) => res.json()),
  };
};

/**
 * Class representing a client for interacting with the Bako Identity.
 */
export class BakoIDClient {
  private httpClient: HTTPClient;

  /**
   * Creates an instance of BakoIDClient.
   * @param {string} [apiURL] - The RPC URL.
   */
  constructor(apiURL?: string) {
    this.httpClient = httpClient({
      url: apiURL ?? API_URL!,
    });
  }

  /**
   * Retrieves records associated with a given owner.
   * @param {string} owner - The owner's identifier.
   * @param {number} chainId - The network to resolve on.
   * @returns {Promise<IDRecord[]>} A promise that resolves to the records.
   */
  async records(owner: string, chainId: number): Promise<IDRecord[]> {
    const { records } = await this.httpClient.get<{ records: IDRecord[] }>(
      resolveNetwork(chainId),
      `/records/${Address.fromDynamicInput(owner).toB256()}`
    );
    return records || [];
  }

  /**
   * Retrieves the resolver address for a given name.
   * @param {string} name - The name to resolve.
   * @param {number} chainId - The network to resolve on.
   * @returns {Promise<string | null>} A promise that resolves to the resolver address.
   */
  async resolver(name: string, chainId: number) {
    const { address } = await this.httpClient.get<{ address: string | null }>(
      resolveNetwork(chainId),
      `/addr/${name}`
    );

    return address ? Address.fromDynamicInput(address).toString() : null;
  }

  /**
   * Retrieves the name associated with a given address.
   * @param {string} addr - The address to resolve.
   * @param {number} chainId - The network to resolve on.
   * @returns {Promise<{ name: string }>} A promise that resolves to the name.
   */
  async name(addr: string, chainId: number) {
    const { name } = await this.httpClient.get<{ name: string | null }>(
      resolveNetwork(chainId),
      `/name/${Address.fromDynamicInput(addr).toB256()}`
    );
    return name ?? null;
  }

  /**
   * Retrieves the profile URL for a given name.
   * @param {string} name - The name to resolve.
   * @returns {string} The profile URL.
   */
  profile(name: string) {
    return `${UI_URL}/${name.replace('@', '')}`;
  }
}
