import { type NetworkKeys, resolveNetwork } from '@bako-id/contracts';
import type { Provider } from 'fuels';

const { API_URL } = process.env;

export enum Networks {
  MAINNET = 9889,
  TESTNET = 0,
}

export type IDRecord = {
  name: string;
  resolver: string;
  owner: string;
  type?: string;
  assetId: string;
};

export type OffChainData = {
  resolversName: Record<string, string>;
  resolversAddress: Record<string, string>;
  records: Record<string, IDRecord[]>;
};

type HTTPClient = ReturnType<typeof httpClient>;
type HTTPClientConfig = {
  url: string;
  network: string;
};

const httpClient = (config: HTTPClientConfig) => {
  const apiUrl = `${config.url}/${config.network}`;
  return {
    get: async <R>(endpoint: string) =>
      fetch(`${apiUrl}${endpoint}`).then((res) => res.json() as Promise<R>),
    post: async <T>(endpoint: string, body: T) =>
      fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((res) => res.json()),
  };
};

export type RegisterInput = {
  owner: string;
  domain: string;
  period: number;
  resolver: string;
  transactionId: string;
};

/**
 * Class representing a client for interacting with the BakoID API.
 */
export class BakoIDClient {
  private network: NetworkKeys;
  private httpClient: HTTPClient;

  /**
   * Creates an instance of BakoIDClient.
   * @param {Provider | string} provider - The provider instance or URL.
   * @param {string} [apiURL=API_URL] - The API URL.
   */
  constructor(provider: Provider | string, apiURL: string = API_URL!) {
    const providerUrl = typeof provider === 'string' ? provider : provider.url;
    this.network = resolveNetwork(providerUrl);
    this.httpClient = httpClient({
      url: apiURL,
      network: this.network,
    });
  }

  /**
   * Registers a new domain.
   * @param {RegisterInput} params - The registration parameters.
   * @returns {Promise<any>} A promise that resolves to the registration response.
   */
  async register(params: RegisterInput) {
    return this.httpClient.post('/register', params);
  }

  /**
   * Retrieves records associated with a given owner.
   * @param {string} owner - The owner's identifier.
   * @returns {Promise<IDRecord[]>} A promise that resolves to the records.
   */
  async records(owner: string) {
    const { records } = await this.httpClient.get<{ records: IDRecord[] }>(
      `/records/${owner}`
    );
    return records || [];
  }

  /**
   * Retrieves the resolver address for a given name.
   * @param {string} name - The name to resolve.
   * @returns {Promise<string | null>} A promise that resolves to the resolver address.
   */
  async resolver(name: string) {
    const { address } = await this.httpClient.get<{ address: string | null }>(
      `/addr/${name}`
    );

    return address ?? null;
  }

  /**
   * Retrieves the name associated with a given address.
   * @param {string} addr - The address to resolve.
   * @returns {Promise<{ name: string }>} A promise that resolves to the name.
   */
  async name(addr: string) {
    const { name } = await this.httpClient.get<{ name: string | null }>(
      `/name/${addr}`
    );
    return name ?? null;
  }
}
