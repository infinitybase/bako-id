import { TransactionStatus, bn, getDecodedLogs } from 'fuels';
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
      wallets: [deployer],
    } = node;

    manager = new Manager(managerAbi.id, deployer);
    registry = new Registry(registryAbi.id, deployer);
    nft = new Nft(nftAbi.id, deployer);

    const nftCall = await nft.functions
      .constructor({ ContractId: { bits: registry.id.toB256() } })
      .call();
    await nftCall.waitForResult();

    const registerCall = await registry.functions
      .constructor({ bits: manager.id.toB256() }, { bits: nftAbi.id.toB256() })
      .call();
    await registerCall.waitForResult();

    const managerCall = await manager.functions
      .constructor({ ContractId: { bits: registry.id.toB256() } })
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
      const { waitForResult } = await registry.functions
        .constructor(
          { bits: manager.id.toB256() },
          { bits: manager.id.toB256() }
        )
        .call();
      const { transactionResult } = await waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectContainLogError(error, 'AlreadyInitialized');
      expectRequireRevertError(error);
    }
  });

  it('should dont register domain when not available', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;
    const domain = randomName();

    const price = domainPrices(domain);

    try {
      const res = await registry.functions
        .register(domain, { Address: { bits: owner.address.toB256() } }, bn(1))
        .addContracts([manager, nft])
        .callParams({
          forward: { assetId: provider.getBaseAssetId(), amount: price },
        })
        .call();

      const response = await res.waitForResult();
      const a = getDecodedLogs(
        response.transactionResult.receipts,
        registry.interface.jsonAbi,
        {
          [manager.id.toB256()]: manager.interface.jsonAbi,
          [nft.id.toB256()]: nft.interface.jsonAbi,
        }
      );

      console.log(a);

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
      expectContainLogError(error, 'AlreadyMinted');
      expectRequireRevertError(error);
    }
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
