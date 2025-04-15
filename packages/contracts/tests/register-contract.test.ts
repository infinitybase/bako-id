import { TransactionStatus, Wallet, bn, getRandomB256 } from 'fuels';
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
          forward: { assetId: await provider.getBaseAssetId(), amount: price },
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
          { bits: manager.id.toB256() },
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
          forward: { assetId: await provider.getBaseAssetId(), amount: price },
        })
        .call();

      const { waitForResult } = await registry.functions
        .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
        .addContracts([manager, nft])
        .callParams({
          forward: { assetId: await provider.getBaseAssetId(), amount: price },
        })
        .call();
      const { transactionResult } = await waitForResult();

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
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
        forward: { assetId: await provider.getBaseAssetId(), amount: price },
      })
      .call();

    const { transactionResult } = await registerCallFn.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should transfer funds correctly', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;
    const domain = randomName(3);

    const baseAssetId = await provider.getBaseAssetId();
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
        { bits: recipient.address.toB256() },
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

    const baseAssetId = await provider.getBaseAssetId();
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
          { bits: recipient.address.toB256() },
        )
        .call();
      await transferCall.waitForResult();
    }).rejects.toThrow(/NotOwner/);
  });

  it('should transfer ownership correctly', async () => {
    const [owner, newOwner] = node.wallets;
    const baseAssetId = await node.provider.getBaseAssetId();

    const registryDeploy = await RegistryFactory.deploy(owner);
    const { contract: registry } = await registryDeploy.waitForResult();

    const contractFund = await owner.transferToContract(
      registry.id,
      bn(100),
      baseAssetId,
    );
    await contractFund.waitForResult();

    const constructCall = await registry.functions
      .constructor(
        { bits: owner.address.toB256() },
        { bits: manager.id.toB256() },
        { bits: manager.id.toB256() },
      )
      .call();
    const { transactionResult } = await constructCall.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);

    const transferOwnerShipCall = await registry.functions
      .transfer_ownership({ bits: newOwner.address.toB256() })
      .call();
    const transferOwnershipResult = await transferOwnerShipCall.waitForResult();
    expect(transferOwnershipResult.transactionResult.status).toBe(
      TransactionStatus.success,
    );

    await expect(async () => {
      const { waitForResult } = await registry.functions
        .transfer_funds(
          bn(100),
          { bits: baseAssetId },
          { bits: newOwner.address.toB256() },
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

  it('should error on register when contract is paused', async () => {
    const [owner] = node.wallets;

    const nftDeploy = await NftFactory.deploy(owner);
    const managerDeploy = await ManagerFactory.deploy(owner);
    const registryDeploy = await RegistryFactory.deploy(owner);

    const { contract: nft } = await nftDeploy.waitForResult();
    const { contract: manager } = await managerDeploy.waitForResult();
    const { contract: registry } = await registryDeploy.waitForResult();

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
        { bits: nft.id.toB256() },
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

    let { value: isPaused } = await registry.functions.is_paused().get();
    expect(isPaused).toBe(false);

    const pauseCall = await registry.functions.pause().call();
    await pauseCall.waitForResult();

    ({ value: isPaused } = await registry.functions.is_paused().get());
    expect(isPaused).toBe(true);

    await expect(async () => {
      const registerCallFn = await registry.functions
        .register(
          '@domainn',
          { Address: { bits: owner.address.toB256() } },
          bn(1),
        )
        .addContracts([manager, nft])
        .callParams({
          forward: {
            assetId: await node.provider.getBaseAssetId(),
            amount: domainPrices('@domainn'),
          },
        })
        .call();
      await registerCallFn.waitForResult();
    }).rejects.toThrow(/Paused/);
  });

  it('should change the resolver correctly', async () => {
    const [owner, notOwner] = node.wallets;
    const domain = randomName(3);

    const resolver = Wallet.generate({ provider: node.provider });

    const price = domainPrices(domain);

    const registerCallFn = await registry.functions
      .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
      .addContracts([manager, nft])
      .callParams({
        forward: {
          assetId: await node.provider.getBaseAssetId(),
          amount: price,
        },
      })
      .call();
    await registerCallFn.waitForResult();

    // Change resolver correctly
    const changeResolverCall = await registry.functions
      .set_resolver(domain, { Address: { bits: resolver.address.toB256() } })
      .addContracts([manager])
      .call();
    await changeResolverCall.waitForResult();

    const { value: newResolver } = await manager.functions
      .get_resolver(domain)
      .get();
    expect(newResolver?.Address?.bits).toBe(resolver.address.toB256());

    // Should throw an error when change to a resolver in use
    await expect(async () => {
      const changeResolverCall = await registry.functions
        .set_resolver(domain, { Address: { bits: resolver.address.toB256() } })
        .addContracts([manager])
        .call();
      await changeResolverCall.waitForResult();
    }).rejects.toThrow(/ResolverAlreadyInUse/);

    // Should throw an error when not owner
    registry.account = notOwner;

    await expect(async () => {
      const changeResolverCall = await registry.functions
        .set_resolver(domain, { Address: { bits: resolver.address.toB256() } })
        .addContracts([manager])
        .call();
      await changeResolverCall.waitForResult();
    }).rejects.toThrow(/NotOwner/);

    registry.account = owner;
  });

  it('should change the owner correctly', async () => {
    const [owner, newOwner] = node.wallets;
    const domain = randomName(3);

    const price = domainPrices(domain);

    const registerCallFn = await registry.functions
      .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
      .addContracts([manager, nft])
      .callParams({
        forward: {
          assetId: await node.provider.getBaseAssetId(),
          amount: price,
        },
      })
      .call();
    await registerCallFn.waitForResult();

    // Change owner correctly
    const changeOwnerCall = await registry.functions
      .set_owner(domain, { Address: { bits: newOwner.address.toB256() } })
      .addContracts([manager])
      .call();
    await changeOwnerCall.waitForResult();

    const { value: newOwnerAddress } = await manager.functions
      .get_owner(domain)
      .get();
    expect(newOwnerAddress?.Address?.bits).toBe(newOwner.address.toB256());

    // Should throw an error when not owner
    await expect(async () => {
      const changeOwnerCall = await registry.functions
        .set_owner(domain, { Address: { bits: newOwner.address.toB256() } })
        .addContracts([manager])
        .call();
      await changeOwnerCall.waitForResult();
    }).rejects.toThrow(/NotOwner/);
  });

  it('should change the primary handle correctly', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;

    const secondDomain = randomName();

    const actualPrimaryResolver = { Address: { bits: owner.address.toB256() } };
    const resolverAddress = { Address: { bits: getRandomB256() } };

    const price2 = domainPrices(secondDomain);

    const { value: firstDomain } = await manager.functions
      .get_name(actualPrimaryResolver)
      .get();

    // register the second domain
    const { waitForResult: registerCall2 } = await registry.functions
      .register(secondDomain, resolverAddress, bn(1))
      .addContracts([manager, nft])
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price2 },
      })
      .call();
    await registerCall2();

    // set the second domain as the primary handle
    const { waitForResult: awaitChangePrimaryHandle } = await registry.functions
      .set_primary_handle(secondDomain)
      .addContracts([manager])
      .call();
    await awaitChangePrimaryHandle();

    const { value: newPrimaryHandle } = await manager.functions
      .get_name(actualPrimaryResolver)
      .get();

    expect(newPrimaryHandle).not.toBe(firstDomain);
    expect(newPrimaryHandle).toBe(secondDomain);
  });

  it('should error when trying to change the primary handle to the same domain', async () => {
    const { wallets } = node;
    const [owner] = wallets;

    const actualPrimaryResolver = { Address: { bits: owner.address.toB256() } };

    const { value: firstDomain } = await manager.functions
      .get_name(actualPrimaryResolver)
      .get();

    // set the primary handle again, which should fail
    await expect(async () => {
      await registry.functions
        .set_primary_handle(firstDomain!)
        .addContracts([manager])
        .call();
    }).rejects.toThrow(/AlreadyPrimaryHandle/);
  });

  it('should error when trying to change the primary handle if it is not the owner', async () => {
    const { wallets } = node;
    const [owner, notOwner] = wallets;

    const notOwnerRegistry = new Registry(registry.id, notOwner);

    const { value: actualOwnerPrimaryHandle } = await manager.functions
      .get_name({
        Address: { bits: owner.address.toB256() },
      })
      .get();

    await expect(async () => {
      await notOwnerRegistry.functions
        .set_primary_handle(actualOwnerPrimaryHandle!)
        .addContracts([manager])
        .call();
    }).rejects.toThrow(/NotOwner/);
  });

  it.each(['@invalid-!@#%$!', 'my@asd.other', '@MYHanDLE'])(
    'should throw a error when try register %s',
    async (handle) => {
      const { provider, wallets } = node;
      const [owner] = wallets;
      const price = domainPrices(handle);

      const register = async (name: string) =>
        registry.functions
          .register(name, { Address: { bits: owner.address.toB256() } }, bn(1))
          .addContracts([manager])
          .callParams({
            forward: {
              assetId: await provider.getBaseAssetId(),
              amount: price,
            },
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
    },
  );
});
