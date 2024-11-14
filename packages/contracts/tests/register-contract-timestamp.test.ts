import { DateTime, bn } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  Manager,
  ManagerFactory,
  Nft,
  NftFactory,
  Registry,
  RegistryFactory,
} from '../src';
import { domainPrices, randomName } from './utils';

describe('[INFOS] Registry Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let manager: Manager;
  let registry: Registry;
  let nft: Nft;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: ManagerFactory },
        { factory: RegistryFactory },
        { factory: NftFactory },
      ],
    });

    const {
      contracts: [managerAbi, registryAbi, nftAbi],
      wallets: [owner],
    } = node;

    manager = new Manager(managerAbi.id, owner);
    registry = new Registry(registryAbi.id, owner);
    nft = new Nft(nftAbi.id, owner);

    const nftCall = await nft.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } }
      )
      .call();
    await nftCall.waitForResult();

    const { waitForResult } = await registry.functions
      .constructor(
        { bits: owner.address.toB256() },
        { bits: manager.id.toB256() },
        { bits: nftAbi.id.toB256() }
      )
      .call();
    await waitForResult();

    const { waitForResult: waitForManager } = await manager.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } }
      )
      .call();
    await waitForManager();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should get correctly timestamp', async () => {
    const { wallets, provider } = node;
    const [deployer] = wallets;

    const name = randomName();
    const price = domainPrices(name);

    const formatDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

    const { waitForResult: waitForRegister } = await registry.functions
      .register(
        name,
        {
          Address: { bits: deployer.address.toB256() },
        },
        bn(1)
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager, nft])
      .call();

    const {
      transactionResult: { date },
    } = await waitForRegister();

    const { value: timestamp } = await registry.functions.timestamp(name).get();

    const registeredAt = formatDate(date!);
    const timestampDate = formatDate(DateTime.fromTai64(timestamp!.toString()));

    expect(registeredAt).toEqual(timestampDate);
  });

  it('should get correctly ttl', async () => {
    const { wallets, provider } = node;
    const [deployer] = wallets;

    const name = randomName();
    const price = domainPrices(name);
    const period = 1;

    const formatDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

    const { waitForResult: waitForRegister } = await registry.functions
      .register(
        name,
        {
          Address: { bits: deployer.address.toB256() },
        },
        bn(period)
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager, nft])
      .call();
    await waitForRegister();

    const { value: timestamp } = await registry.functions.timestamp(name).get();
    const { value: ttl } = await registry.functions.ttl(name).get();

    const ttlDate = formatDate(DateTime.fromTai64(ttl!.toString()));
    const timestampDate = formatDate(DateTime.fromTai64(timestamp!.toString()));
    timestampDate.setFullYear(timestampDate.getFullYear() + period);

    expect(ttlDate).toEqual(timestampDate);
  });

  it('should get empty infos when record not exists', async () => {
    const name = randomName();

    const { value: timestamp } = await registry.functions.timestamp(name).get();
    const { value: ttl } = await registry.functions.ttl(name).get();

    expect(timestamp).toBeUndefined();
    expect(ttl).toBeUndefined();
  });
});
