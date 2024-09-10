import {
  Provider,
  TransactionStatus,
  type WalletUnlocked,
  ZeroBytes32,
  hash,
} from 'fuels';
import {
  TestCallerContract,
  TestRegistryContract,
  TestStorageContract,
  WALLET_PRIVATE_KEYS,
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  fundWallet,
  txParams,
} from './utils';

describe('Test Storage Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider);
  });

  it('should error on call method without a storage contract started', async () => {
    expect.assertions(2);

    const storage = await TestStorageContract.startup(wallet, ZeroBytes32);

    try {
      const storageSetFn = await storage.functions
        .set(hash(Buffer.from('20')), wallet.address.toB256(), [10, 10])
        .txParams(txParams)
        .call();

      await storageSetFn.waitForResult();
    } catch (e) {
      expectRequireRevertError(e);
      expectContainLogError(e, 'Unauthorized');
    }
  });

  it('should error on call storage by other contract', async () => {
    const storage = await TestStorageContract.deploy(wallet);
    const testCaller = await TestCallerContract.deploy(wallet);

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

    const storage = await TestStorageContract.startup(wallet, ZeroBytes32);

    try {
      await storage.functions
        .constructor({ bits: ZeroBytes32 }, { bits: ZeroBytes32 })
        .call();
    } catch (e) {
      expectRequireRevertError(e);
    }
  });

  it('should get contract implementation', async () => {
    const registry = await TestRegistryContract.deploy(wallet);
    const storage = await TestStorageContract.startup(
      wallet,
      registry.id.toB256()
    );

    const callFn = await storage.functions
      .get_implementation()
      .txParams(txParams)
      .call();

    const { transactionResult, value } = await callFn.waitForResult();

    expect(transactionResult.status).toBe(TransactionStatus.success);
    expect(value.bits).toBe(registry.id.toB256());
  });

  it('should error on change contract implementation', async () => {
    const walletFake = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);

    const testCaller = await TestCallerContract.deploy(wallet);
    const storage = await TestStorageContract.startup(
      wallet,
      testCaller.id.toB256()
    );

    // Change implementation to testContract
    const { value: implementationAddress } = await storage.functions
      .get_implementation()
      .txParams(txParams)
      .get();
    expect(implementationAddress.bits).toBe(testCaller.id.toB256());

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
    expect(zerobytesContract.bits).toBe(ZeroBytes32);

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
    const walletFake = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);
    await fundWallet(walletFake);

    const storage = await TestStorageContract.startup(wallet, ZeroBytes32);

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
      .set_owner({ bits: wallet.address.toB256() })
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
    expect(storageOwner.bits).toBe(wallet.address.toB256());

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
