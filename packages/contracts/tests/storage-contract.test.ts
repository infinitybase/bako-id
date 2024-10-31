import { TransactionStatus, ZeroBytes32, hash } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  RegistryContractFactory,
  StorageContractFactory,
  TestContractFactory,
} from '../src';
import {
  TestCallerContract,
  TestRegistryContract,
  TestStorageContract,
  expectContainLogError,
  expectRequireRevertError,
  txParams,
} from './utils';

describe('Test Storage Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let storage: TestStorageContract;
  let registry: TestRegistryContract;
  let _testCaller: TestCallerContract;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: StorageContractFactory },
        { factory: RegistryContractFactory },
        { factory: TestContractFactory },
      ],
    });

    const {
      contracts: [storageAbi, registryAbi, testCallerAbi],
      wallets: [deployer],
    } = node;

    storage = new TestStorageContract(storageAbi.id, deployer);
    registry = new TestRegistryContract(registryAbi.id, deployer);
    _testCaller = new TestCallerContract(testCallerAbi.id, deployer);

    await storage.initialize(deployer, registry.id.toB256());
    await registry.initialize({
      owner: deployer,
      storageId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error on call method without a storage contract started', async () => {
    expect.assertions(2);

    const [owner] = node.wallets;
    const storage = await TestStorageContract.startup(owner, ZeroBytes32);

    try {
      const storageSetFn = await storage.functions
        .set(hash(Buffer.from('20')), owner.address.toB256(), [10, 10])
        .addContracts([storage])
        .txParams(txParams)
        .call();

      await storageSetFn.waitForResult();
    } catch (e) {
      expectRequireRevertError(e);
      expectContainLogError(e, 'Unauthorized');
    }
  });

  it('should error on call storage by other contract', async () => {
    const [owner] = node.wallets;

    const storage = await TestStorageContract.deploy(owner);
    const testCaller = await TestCallerContract.deploy(owner);

    expect.assertions(2);

    try {
      await testCaller.functions
        .test_set({
          bits: storage.id.toB256(),
        })
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (e) {
      expectRequireRevertError(e);
      expectContainLogError(e, 'Unauthorized');
    }
  });

  it('should error on initialize storage when already initialized', async () => {
    expect.assertions(1);
    try {
      await storage.functions
        .constructor({ bits: ZeroBytes32 }, { bits: ZeroBytes32 })
        .call();
    } catch (e) {
      expectRequireRevertError(e);
    }
  });

  it('should get contract implementation', async () => {
    const callFn = await storage.functions
      .get_implementation()
      .txParams(txParams)
      .call();

    const { transactionResult, value } = await callFn.waitForResult();

    expect(transactionResult.status).toBe(TransactionStatus.success);
    expect(value?.bits).toBe(registry.id.toB256());
  });

  it('should error on change contract implementation', async () => {
    const [owner, walletFake] = node.wallets;

    const testCaller = await TestCallerContract.deploy(owner);
    const storage = await TestStorageContract.startup(
      owner,
      testCaller.id.toB256()
    );

    // Change implementation to testContract
    const { value: implementationAddress } = await storage.functions
      .get_implementation()
      .txParams(txParams)
      .get();
    expect(implementationAddress?.bits).toBe(testCaller.id.toB256());

    // Execute method in testContract
    const testSetCall = await testCaller.functions
      .test_set({
        bits: storage.id.toB256(),
      })
      .addContracts([storage])
      .txParams(txParams)
      .call();
    const { transactionResult: storageResult } =
      await testSetCall.waitForResult();
    expect(storageResult.status).toBe(TransactionStatus.success);

    // Change implementation to zero bytes contract
    const implementationCall = await storage.functions
      .set_implementation({ bits: ZeroBytes32 })
      .txParams(txParams)
      .call();
    await implementationCall.waitForResult();
    const { value: zerobytesContract } = await storage.functions
      .get_implementation()
      .txParams(txParams)
      .get();
    expect(zerobytesContract?.bits).toBe(ZeroBytes32);

    try {
      // Try set implementation with fake wallet
      storage.account = walletFake;
      const unauthorizedCall = await storage.functions
        .set_implementation({ bits: testCaller.id.toB256() })
        .txParams(txParams)
        .call();

      const { transactionResult } = await unauthorizedCall.waitForResult();

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expectContainLogError(e, 'Unauthorized');
      expectRequireRevertError(e);
    }
  });

  it('should try change owner of storage', async () => {
    const [owner, walletFake] = node.wallets;

    // Change owner to walletFake
    const ownerFn = await storage.functions
      .set_owner({ bits: walletFake.address.toB256() })
      .txParams(txParams)
      .call();
    const { transactionResult } = await ownerFn.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);

    // Change owner to main wallet
    storage.account = walletFake;
    const fakeWalletOwnerFn = await storage.functions
      .set_owner({ bits: owner.address.toB256() })
      .txParams(txParams)
      .call();
    const { transactionResult: transactionResult2 } =
      await fakeWalletOwnerFn.waitForResult();
    expect(transactionResult2.status).toBe(TransactionStatus.success);

    // Get owner from storage contract
    const { value: storageOwner } = await storage.functions
      .get_owner()
      .txParams(txParams)
      .get();
    expect(storageOwner?.bits).toBe(owner.address.toB256());

    try {
      // Try change owner with other wallet
      storage.account = walletFake;
      await storage.functions
        .set_owner({ bits: walletFake.address.toB256() })
        .txParams(txParams)
        .call();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expectContainLogError(e, 'Unauthorized');
      expectRequireRevertError(e);
    }
  });
});
