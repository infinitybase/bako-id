import { type NetworkKeys, resolveNetwork } from '@bako-id/contracts';
import { Address, type Provider, hashMessage } from 'fuels';
import type { OffChainData, RegisterInput } from '../../methods';

export class BakoIDClientMock {
  static list: Map<string, OffChainData> = new Map();
  private network: NetworkKeys;

  constructor(provider: Provider | string, _apiURL = '') {
    const providerUrl = typeof provider === 'string' ? provider : provider.url;
    this.network = resolveNetwork(providerUrl);
    BakoIDClientMock.list.set(this.network, {
      records: {},
      resolversAddress: {},
      resolversName: {},
    });
  }

  async register(params: RegisterInput): Promise<void> {
    const resolverData = this.getList();

    params.owner = Address.fromDynamicInput(params.owner).toB256();
    params.resolver = Address.fromDynamicInput(params.resolver).toB256();

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

    BakoIDClientMock.list.set(this.network, resolverData);
  }

  async resolver(key: string) {
    const resolver = this.getList()?.resolversName?.[key];
    return resolver ? Address.fromDynamicInput(resolver).toB256() : null;
  }

  async name(key: string) {
    const name =
      this.getList()?.resolversAddress?.[
        Address.fromDynamicInput(key).toB256()
      ];
    return name ?? null;
  }

  async records(owner: string) {
    const records =
      this.getList()?.records?.[Address.fromDynamicInput(owner).toB256()] || [];
    return records;
  }

  private getList(): OffChainData {
    return (
      BakoIDClientMock.list.get(this.network) || {
        records: {},
        resolversAddress: {},
        resolversName: {},
      }
    );
  }
}
