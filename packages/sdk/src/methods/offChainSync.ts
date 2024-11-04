import dotenv from 'dotenv';
import { Provider } from 'fuels';
import { RegisterPayload } from './registry';

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
   * funcao statica que cria uma instancia do offchain
   *
   * @param {Provider}
   *
   * @returns {Promise<OffChainSync>}
   *
   */
  static async create(provider: Provider) {
    const resolvers = await OffChainSync.getJsonFile(provider.getChainId());
    return new OffChainSync(resolvers, provider);
  }

  private static async getJsonFile(chainId: number): Promise<OffChainData> {
    return await fetch(
      `https://bako-id.s3.us-east-1.amazonaws.com/${chainId}/resolver.json`,
    ).then((res) => res.json());
  }

  /**
   * funcao statica que sincroniza o offchain com o onchain
   *
   * @param {Omit<RegisterPayload>}
   * @param {Provider}
   * @param {tx_id}
   *
   * @returns {Promise<RegisterPayload>}
   *
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
}
