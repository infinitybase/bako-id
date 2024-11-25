import { type NetworkKeys, resolveNetwork } from '@bako-id/contracts';
import { Address, type Provider } from 'fuels';

const { API_URL } = process.env;

const UI_URL = 'https://app.bako.id';

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
   * @param {string} [apiURL] - The API URL.
   */
  constructor(provider: Provider | string, apiURL?: string) {
    const providerUrl = typeof provider === 'string' ? provider : provider.url;
    this.network = resolveNetwork(providerUrl);
    this.httpClient = httpClient({
      url: apiURL ?? API_URL!,
      network: this.network,
    });
  }

  /**
   * Registers a new domain.
   * @param {RegisterInput} params - The registration parameters.
   * @returns {Promise<any>} A promise that resolves to the registration response.
   */
  async register(params: RegisterInput) {
    return this.httpClient.post('/register', {
      ...params,
      domain: params.domain.replace('@', ''),
      owner: Address.fromDynamicInput(params.owner).toB256(),
      resolver: Address.fromDynamicInput(params.resolver).toB256(),
    });
  }

  /**
   * Retrieves records associated with a given owner.
   * @param {string} owner - The owner's identifier.
   * @returns {Promise<IDRecord[]>} A promise that resolves to the records.
   */
  async records(owner: string) {
    const { records } = await this.httpClient.get<{ records: IDRecord[] }>(
      `/records/${Address.fromDynamicInput(owner).toB256()}`
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

    return address ? Address.fromDynamicInput(address).toString() : null;
  }

  /**
   * Retrieves the name associated with a given address.
   * @param {string} addr - The address to resolve.
   * @returns {Promise<{ name: string }>} A promise that resolves to the name.
   */
  async name(addr: string) {
    const { name } = await this.httpClient.get<{ name: string | null }>(
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
    return `${UI_URL}/profile/${name.replace('@', '')}?network=${this.network}`;
  }
}
