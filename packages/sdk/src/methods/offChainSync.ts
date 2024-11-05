import dotenv from 'dotenv';
import { Provider } from 'fuels';
import { RegisterPayload } from './registry';

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

  async syncData(): Promise<void> {
    this.list = await OffChainSync.getJsonFile(this.provider.getChainId());
    return;
  }

  async selectNetwork(provider: Provider): Promise<void> {
    OffChainSync.validNetwork(provider);
    if (this.provider.url !== provider.url) {
      this.provider = provider;
    }
    return await this.syncData();
  }

  /**
   * funcao statica que cria uma instancia do offchain
   *
   * @param {Provider}
   *
   * @returns {Promise<OffChainSync>}
   *
   */
  static async create(provider: Provider): Promise<OffChainSync> {
    OffChainSync.validNetwork(provider);
    const resolvers = await OffChainSync.getJsonFile(provider.getChainId());
    return new OffChainSync(resolvers, provider);
  }

  private static async getJsonFile(chainId: number): Promise<OffChainData> {
    return await fetch(
      `${OFF_CHAIN_DATA_URL}/${chainId}/${RESOLVER_FILENAME}`,
    ).then((res) => res.json());
  }

  private static validNetwork(provider: Provider): void {
    if (!Object.values(Networks).includes(provider.getChainId()))
      throw new Error('Invalid network');

    return;
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
