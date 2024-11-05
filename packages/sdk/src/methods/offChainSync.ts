import dotenv from 'dotenv';
import type { Provider } from 'fuels';
import type { RegisterPayload } from './registry';

dotenv.config();

const { API_URL } = process.env;

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

  private constructor(list: OffChainData, provider: Provider) {
    this.list = list;
    this.provider = provider;
  }

  getResolver(key: string): string {
    return this.list?.resolversName?.[key];
  }

  getDomain(key: string): string {
    return this.list?.resolversAddress?.[key];
  }

  getRecords(resolver: string): IDRecord[] {
    return this.list?.records?.[resolver] || [];
  }

  async syncData() {
    this.list = await OffChainSync.getJsonFile(this.provider.getChainId());
  }

  /**
   * Static function that creates a new instance of OffChainSync
   *
   * @param {Provider} provider
   *
   * @returns {Promise<OffChainSync>}
   *
   */
  static async create(provider: Provider): Promise<OffChainSync> {
    const resolvers = await OffChainSync.getJsonFile(provider.getChainId());
    return new OffChainSync(resolvers, provider);
  }

  private static async getJsonFile(chainId: number): Promise<OffChainData> {
    return await fetch(
      `https://bako-id.s3.us-east-1.amazonaws.com/${chainId}/resolver.json`
    ).then((res) => res.json());
  }

  /**
   * Static function that sets a new register payload
   *
   * @param {Omit<RegisterPayload>} params
   * @param {Provider} provider
   * @param {string} tx_id
   *
   * @returns {Promise<void>}
   *
   */
  static async setNew(
    params: RegisterPayload,
    provider: Provider,
    tx_id: string
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
}
