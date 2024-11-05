import dotenv from 'dotenv';
import type { Provider } from 'fuels';
import type { RegisterPayload } from './registry';

dotenv.config();

const { API_URL } = process.env;
export const OFF_CHAIN_DATA_URL = 'https://bako-id.s3.us-east-1.amazonaws.com';
export const RESOLVER_FILENAME = 'resolver.json';

export enum Networks {
  MAINNET = 9889,
  TESTNET = 0,
}

export type IDRecord = {
  name: string;
  resolver: string;
  owner: string;
  type: string;
  assetId: string;
};

export type OffChainData = {
  resolversName: Record<string, string>;
  resolversAddress: Record<string, string>;
  records: Record<string, IDRecord[]>;
};

export class OffChainSync {
  provider: Provider;
  list: OffChainData;

  /**
   * Private constructor for the OffChainSync class.
   * @param {OffChainData} list - The off-chain data.
   * @param {Provider} provider - The provider instance.
   */
  private constructor(list: OffChainData, provider: Provider) {
    this.list = list;
    this.provider = provider;
  }

  /**
   * Creates an instance of OffChainSync.
   * @param {Provider} provider - The provider instance.
   * @returns {Promise<OffChainSync>} A promise that resolves to an OffChainSync instance.
   * @throws {Error} If the network is invalid.
   */
  static async create(provider: Provider): Promise<OffChainSync> {
    OffChainSync.validNetwork(provider);
    const resolvers = await OffChainSync.getJsonFile(provider.getChainId());
    return new OffChainSync(resolvers, provider);
  }

  /**
   * Sets new off-chain data by synchronizing with on-chain data.
   * @param {RegisterPayload} params - The registration payload.
   * @param {Provider} provider - The provider instance.
   * @param {string} tx_id - The transaction ID.
   * @returns {Promise<void>} A promise that resolves when the data is set.
   */
  static async setNew(
    params: RegisterPayload,
    provider: Provider,
    tx_id: string,
  ): Promise<void> {
    await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        params,
        provider: provider.url,
        tx_id,
      }),
    });
  }

  /**
   * Fetches JSON data from a specified URL based on the chain ID.
   * @private
   * @param {number} chainId - The chain ID.
   * @returns {Promise<OffChainData>} A promise that resolves to the off-chain data.
   */
  private static async getJsonFile(chainId: number): Promise<OffChainData> {
    return await fetch(
      `${OFF_CHAIN_DATA_URL}/${chainId}/${RESOLVER_FILENAME}`,
    ).then((res) => res.json());
  }

  /**
   * Validates if the provided network is supported.
   * @private
   * @param {Provider} provider - The provider instance.
   * @throws {Error} If the network is invalid.
   */
  private static validNetwork(provider: Provider): void {
    if (!Object.values(Networks).includes(provider.getChainId())) {
      throw new Error('Invalid network');
    }
  }

  /**
   * Retrieves a resolver by key.
   * @param {string} key - The key to retrieve the resolver.
   * @returns {string} The resolver associated with the key.
   */
  getResolver(key: string): string {
    return this.list?.resolversName?.[key];
  }

  /**
   * Retrieves a domain by key.
   * @param {string} key - The key to retrieve the domain.
   * @returns {string} The domain associated with the key.
   */
  getDomain(key: string): string {
    return this.list?.resolversAddress?.[key];
  }

  /**
   * Retrieves records associated with a given resolver.
   * @param {string} resolver - The resolver key.
   * @returns {IDRecord[]} An array of ID records.
   */
  getRecords(resolver: string): IDRecord[] {
    return this.list?.records?.[resolver] || [];
  }

  /**
   * Synchronizes the off-chain data.
   * @returns {Promise<void>} A promise that resolves when the data is synchronized.
   */
  async syncData(): Promise<void> {
    this.list = await OffChainSync.getJsonFile(this.provider.getChainId());
  }

  /**
   * Selects a network and synchronizes the data if necessary.
   * @param {Provider} provider - The new provider instance.
   * @returns {Promise<void>} A promise that resolves when the network is selected and data is synchronized.
   * @throws {Error} If the network is invalid.
   */
  async selectNetwork(provider: Provider): Promise<void> {
    OffChainSync.validNetwork(provider);
    if (this.provider.url !== provider.url) {
      this.provider = provider;
    }
    await this.syncData();
  }
}
