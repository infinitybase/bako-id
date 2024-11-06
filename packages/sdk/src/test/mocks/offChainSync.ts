import { type Provider, hashMessage } from 'fuels';
import {
  type IDRecord,
  Networks,
  type OffChainData,
  type RegisterPayload,
} from '../../methods';

export class OffChainSyncMock {
  provider: Provider;
  static list: Map<number, OffChainData> = new Map();

  private constructor(list: OffChainData, provider: Provider) {
    OffChainSyncMock.list.set(provider.getChainId(), list);
    this.provider = provider;
  }

  static async create(provider: Provider): Promise<OffChainSyncMock> {
    console.log('AQUI');
    const resolvers = await OffChainSyncMock.getJsonFile(provider.getChainId());
    return new OffChainSyncMock(resolvers, provider);
  }

  static async setNew(
    params: RegisterPayload,
    provider: Provider,
    _tx_id: string
  ): Promise<void> {
    const resolverData = await OffChainSyncMock.getJsonFile(
      provider.getChainId()
    );

    if (!resolverData?.resolversName?.[params.domain]) {
      resolverData.resolversName[params.domain] = params.resolver;
    }

    if (!resolverData?.resolversAddress?.[params.resolver]) {
      resolverData.resolversAddress[params.resolver] = params.domain;
    }

    if (!resolverData?.records?.[params.resolver]) {
      resolverData.records[params.resolver] = [];
    }

    resolverData.records[params.resolver].push({
      name: params.domain,
      resolver: params.resolver,
      owner: params.resolver,
      type: 'teste',
      assetId: hashMessage(params.domain),
    });

    OffChainSyncMock.list.set(provider.getChainId(), resolverData);
  }

  private static async getJsonFile(_chainId: number): Promise<OffChainData> {
    return (
      OffChainSyncMock.list.get(_chainId) || {
        records: {},
        resolversAddress: {},
        resolversName: {},
      }
    );
  }

  private static validNetwork(provider: Provider): void {
    if (!Object.values(Networks).includes(provider.getChainId())) {
      throw new Error('Invalid network');
    }
  }

  private getList(): OffChainData {
    return (
      OffChainSyncMock.list.get(this.provider.getChainId()) || {
        records: {},
        resolversAddress: {},
        resolversName: {},
      }
    );
  }

  getResolver(key: string): string {
    return this.getList()?.resolversName?.[key];
  }

  getDomain(key: string): string {
    return this.getList()?.resolversAddress?.[key];
  }

  getRecords(owner: string): IDRecord[] {
    return this.getList()?.records?.[owner] || [];
  }

  async syncData(): Promise<void> {
    // this.list = await OffChainSyncMock.getJsonFile(this.provider.getChainId());
  }

  async selectNetwork(provider: Provider): Promise<void> {
    OffChainSyncMock.validNetwork(provider);
    if (this.provider.url !== provider.url) {
      this.provider = provider;
    }
    await this.syncData();
  }
}
