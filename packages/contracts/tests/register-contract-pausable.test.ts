import { TransactionStatus, bn, getRandomB256 } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  Manager,
  ManagerFactory,
  Nft,
  NftFactory,
  Registry,
  RegistryFactory,
} from '../src';
import { domainPrices } from './utils';

describe('[PAUSABLE] Registry Contract', () => {
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
        { ContractId: { bits: registry.id.toB256() } },
      )
      .call();
    await nftCall.waitForResult();

    const registerCall = await registry.functions
      .constructor(
        { bits: owner.address.toB256() },
        { bits: manager.id.toB256() },
        { bits: nftAbi.id.toB256() },
      )
      .call();
    await registerCall.waitForResult();

    const managerCall = await manager.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } },
      )
      .call();
    await managerCall.waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should check contract is not paused', async () => {
    const { value: isPaused } = await registry.functions.is_paused().get();
    expect(isPaused).toBe(false);
  });

  it('should pause contract correctly', async () => {
    const pauseCall = await registry.functions.pause().call();
    const { transactionResult } = await pauseCall.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);

    const { value: isPaused } = await registry.functions.is_paused().get();
    expect(isPaused).toBe(true);
  });

  it('should not register a domain when the contract is paused', async () => {
    const name = '@is_paused';
    const price = domainPrices(name);
    await expect(async () => {
      const { waitForResult: waitForRegister } = await registry.functions
        .register('@is_paused', { Address: { bits: getRandomB256() } }, bn(1))
        .callParams({
          forward: {
            assetId: await node.provider.getBaseAssetId(),
            amount: price,
          },
        })
        .addContracts([manager, nft])
        .call();
      await waitForRegister();
    }).rejects.toThrow(/Paused/);
  });

  it('should unpause contract correctly', async () => {
    const unpauseCall = await registry.functions.unpause().call();
    const { transactionResult } = await unpauseCall.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);

    const { value: isPaused } = await registry.functions.is_paused().get();
    expect(isPaused).toBe(false);
  });

  it('It should ensure that only the owner can execute the methods of pausable', async () => {
    const [owner, notOwner] = node.wallets;

    registry.account = notOwner;

    await expect(async () => {
      const pauseCall = await registry.functions.pause().call();
      await pauseCall.waitForResult();
    }).rejects.toThrow(/NotOwner/);

    await expect(async () => {
      const pauseCall = await registry.functions.unpause().call();
      await pauseCall.waitForResult();
    }).rejects.toThrow(/NotOwner/);

    registry.account = owner;
  });
});
