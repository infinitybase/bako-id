import { type NetworkKeys, resolveNetwork } from '@bako-id/contracts';
import { Address, type Provider, hashMessage, isB256 } from 'fuels';
import type {
  ChangeAddressInput,
  OffChainData,
  RegisterInput,
} from '../../methods';

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

    if (!resolverData?.records?.[params.owner]) {
      resolverData.records[params.owner] = [];
    }

    resolverData.records[params.owner].push({
      name: params.domain,
      resolver: params.resolver,
      owner: params.resolver,
      type: 'teste',
      assetId: hashMessage(params.domain),
    });

    BakoIDClientMock.list.set(this.network, resolverData);
  }

  async changeOwner(params: ChangeAddressInput) {
    const resolverData = this.getList();
    params.domain = params.domain.replace('@', '');
    params.address = Address.fromDynamicInput(params.address).toB256();

    const records = Object.values(resolverData.records).flat();
    const record = records.find((r) => r.name === params.domain);

    if (!record) return;

    const oldOwner = record.owner;
    record.owner = params.address;
    resolverData.records[params.address] =
      resolverData.records[params.address] ?? [];
    resolverData.records[params.address].push(record);
    resolverData.records[oldOwner] = records.filter(
      (r) => r.name !== params.domain
    );

    BakoIDClientMock.list.set(this.network, resolverData);
  }

  async changeResolver(params: ChangeAddressInput) {
    const resolverData = this.getList();
    params.domain = params.domain.replace('@', '');
    params.address = Address.fromDynamicInput(params.address).toB256();

    const records = Object.values(resolverData.records).flat();
    const record = records.find((r) => r.name === params.domain);

    if (!record) return;

    record.resolver = params.address;
    resolverData.resolversName[params.domain] = params.address;

    if (!resolverData.resolversAddress[params.address]) {
      delete resolverData.resolversAddress[record.resolver];
      resolverData.resolversAddress[params.address] = params.domain;
    }

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
    if (isB256(owner)) {
      const records =
        this.getList()?.records?.[Address.fromDynamicInput(owner).toB256()] ||
        [];
      return records;
    }

    return [];
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
