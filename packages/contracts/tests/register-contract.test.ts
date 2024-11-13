import { TransactionStatus, Wallet, bn } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  Manager,
  ManagerFactory,
  Nft,
  NftFactory,
  Registry,
  RegistryFactory,
} from '../src';
import {
  domainPrices,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
  txParams,
} from './utils';

describe('[METHODS] Registry Contract', () => {
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

    const registerCall = await registry.functions
      .constructor(
        { bits: owner.address.toB256() },
        { bits: manager.id.toB256() },
        { bits: nftAbi.id.toB256() }
      )
      .call();
    await registerCall.waitForResult();

    const managerCall = await manager.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } }
      )
      .call();
    await managerCall.waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error on call method without a proxy contract started', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;
    const domain = randomName();

    const { waitForResult: waitForManager } =
      await ManagerFactory.deploy(owner);
    await waitForManager();

    const { waitForResult: waitForRegistry } =
      await RegistryFactory.deploy(owner);
    const { contract: registry } = await waitForRegistry();

    const price = domainPrices(domain);

    try {
      const callFn = await registry.functions
        .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
        .callParams({
          forward: { assetId: provider.getBaseAssetId(), amount: price },
        })
        .addContracts([manager])
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectContainLogError(error, 'ContractNotInitialized');
      expectRequireRevertError(error);
    }
  });

  it('should error to initialize proxy contract when proxy already initialized', async () => {
    try {
      const [owner] = node.wallets;
      const { waitForResult } = await registry.functions
        .constructor(
          { bits: owner.address.toB256() },
          { bits: manager.id.toB256() },
          { bits: manager.id.toB256() }
        )
        .call();
      const { transactionResult } = await waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectContainLogError(error, 'CannotReinitialized');
      expectRequireRevertError(error);
    }
  });

  it('should dont register domain when not available', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;
    const domain = randomName();

    const price = domainPrices(domain);

    try {
      const _res = await registry.functions
        .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
        .addContracts([manager, nft])
        .callParams({
          forward: { assetId: provider.getBaseAssetId(), amount: price },
        })
        .call();

      const { waitForResult } = await registry.functions
        .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
        .addContracts([manager, nft])
        .callParams({
          forward: { assetId: provider.getBaseAssetId(), amount: price },
        })
        .call();
      const { transactionResult } = await waitForResult();

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      console.log(error);
      expectContainLogError(error, 'AlreadyMinted');
      expectRequireRevertError(error);
    }
  });

  it('should register a domain successfully', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;
    const domain = randomName(3);

    const price = domainPrices(domain);

    const registerCallFn = await registry.functions
      .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
      .addContracts([manager, nft])
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .call();

    const { transactionResult } = await registerCallFn.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should transfer funds correctly', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;
    const domain = randomName(3);

    const baseAssetId = provider.getBaseAssetId();
    const price = domainPrices(domain);
    const recipient = Wallet.generate({ provider });

    const registerCallFn = await registry.functions
      .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
      .addContracts([manager, nft])
      .callParams({
        forward: { assetId: baseAssetId, amount: price },
      })
      .call();
    await registerCallFn.waitForResult();

    const contractBalance = await registry.getBalance(baseAssetId);

    const transferCall = await registry.functions
      .transfer_funds(
        contractBalance,
        { bits: baseAssetId },
        { bits: recipient.address.toB256() }
      )
      .call();
    await transferCall.waitForResult();

    const recipientBalance = await recipient.getBalance(baseAssetId);
    expect(recipientBalance.toNumber()).toBe(contractBalance.toNumber());
  });

  it('should error on transfer funds when not owner', async () => {
    const { provider, wallets } = node;
    const [owner, notOwner] = wallets;

    const notOwnerRegistry = new Registry(registry.id, notOwner);

    const domain = randomName(3);

    const baseAssetId = provider.getBaseAssetId();
    const price = domainPrices(domain);
    const recipient = Wallet.generate({ provider });

    const registerCallFn = await notOwnerRegistry.functions
      .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
      .addContracts([manager, nft])
      .callParams({
        forward: { assetId: baseAssetId, amount: price },
      })
      .call();
    await registerCallFn.waitForResult();

    const contractBalance = await notOwnerRegistry.getBalance(baseAssetId);

    await expect(async () => {
      const transferCall = await notOwnerRegistry.functions
        .transfer_funds(
          contractBalance,
          { bits: baseAssetId },
          { bits: recipient.address.toB256() }
        )
        .call();
      await transferCall.waitForResult();
    }).rejects.toThrow(/NotOwner/);
  });

  it('should transfer ownership correctly', async () => {
    const [owner, newOwner] = node.wallets;
    const baseAssetId = node.provider.getBaseAssetId();

    const registryDeploy = await RegistryFactory.deploy(owner);
    const { contract: registry } = await registryDeploy.waitForResult();

    const contractFund = await owner.transferToContract(
      registry.id,
      bn(100),
      baseAssetId
    );
    await contractFund.waitForResult();

    const constructCall = await registry.functions
      .constructor(
        { bits: owner.address.toB256() },
        { bits: manager.id.toB256() },
        { bits: manager.id.toB256() }
      )
      .call();
    const { transactionResult } = await constructCall.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);

    const transferOwnerShipCall = await registry.functions
      .transfer_ownership({ bits: newOwner.address.toB256() })
      .call();
    const transferOwnershipResult = await transferOwnerShipCall.waitForResult();
    expect(transferOwnershipResult.transactionResult.status).toBe(
      TransactionStatus.success
    );

    await expect(async () => {
      const { waitForResult } = await registry.functions
        .transfer_funds(
          bn(100),
          { bits: baseAssetId },
          { bits: newOwner.address.toB256() }
        )
        .call();
      await waitForResult();
    }).rejects.toThrow(/NotOwner/);

    await expect(async () => {
      const transferOwnerShipCall = await registry.functions
        .transfer_ownership({ bits: owner.address.toB256() })
        .call();
      await transferOwnerShipCall.waitForResult();
    }).rejects.toThrow(/NotOwner/);
  });

  it.each(['@invalid-!@#%$!', 'my@asd.other', '@MYHanDLE'])(
    'should throw a error when try register %s',
    async (handle) => {
      const { provider, wallets } = node;
      const [owner] = wallets;
      const price = domainPrices(handle);

      const register = (name: string) =>
        registry.functions
          .register(name, { Address: { bits: owner.address.toB256() } }, bn(1))
          .addContracts([manager])
          .callParams({
            forward: { assetId: provider.getBaseAssetId(), amount: price },
          })
          .call();

      const expectErrors = (error: unknown) => {
        expectContainLogError(error, 'InvalidChars');
        expectRequireRevertError(error);
      };

      expect.assertions(2);

      try {
        await register(handle);
      } catch (error) {
        expectErrors(error);
      }
    }
  );
});
