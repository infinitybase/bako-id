import { Provider, TransactionStatus, type WalletUnlocked, hash } from 'fuels';
import {
  WALLET_PRIVATE_KEYS,
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  fundWallet,
  setupContracts,
  setupContractsAndDeploy,
  testContract,
  tryExecute,
  txParams,
} from './utils';

describe('Test Storage Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider);
    contracts = await setupContractsAndDeploy(wallet);
  });

  it('should error on call method without a storage contract started', async () => {
    expect.assertions(2);
    try {
      const storageSetFn = await contracts.storage.functions
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
    const { testCaller } = await setupContracts(wallet);

    expect.assertions(2);

    try {
      await testCaller.functions
        .test_set({
          bits: contracts.storage.id.toB256(),
        })
        .addContracts([contracts.storage])
        .txParams(txParams)
        .call();
    } catch (e) {
      expectRequireRevertError(e);
      expectContainLogError(e, 'Unauthorized');
    }
  });

  it('should error on initialize storage when already initialized', async () => {
    await tryExecute(contracts.storage.initializeStorage());
    expect.assertions(1);

    try {
      await contracts.storage.initializeStorage();
    } catch (e) {
      expectRequireRevertError(e);
    }
  });

  it('should get contract implementation', async () => {
    await tryExecute(contracts.storage.initializeStorage());

    const callFn = await contracts.storage.functions
      .get_implementation()
      .txParams(txParams)
      .call();

    const { transactionResult, value } = await callFn.waitForResult();

    expect(transactionResult.status).toBe(TransactionStatus.success);
    expect(value.bits).toBe(contracts.registry.id.toB256());
  });

  it('should error on change contract implementation', async () => {
    const walletFake = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);
    const { testCaller } = await setupContracts(wallet);

    const storage = { ...contracts.storage };
    const storage2 = storage.connect(walletFake);

    await tryExecute(storage.initializeStorage());

    // Change implementation to testContract
    const implementationCall = await storage.functions
      .set_implementation({ bits: testContract })
      .txParams(txParams)
      .call();
    const { transactionResult } = await implementationCall.waitForResult();
    const getImplementationCall = await storage.functions
      .get_implementation()
      .txParams(txParams)
      .call();
    const { value } = await getImplementationCall.waitForResult();
    expect(value.bits).toBe(testContract);
    expect(transactionResult.status).toBe(TransactionStatus.success);

    // Execute method in testContract
    const testSetCall = await testCaller.functions
      .test_set({
        bits: storage.id.toB256(),
      })
      .txParams(txParams)
      .call();
    const { transactionResult: transactionResult2 } =
      await testSetCall.waitForResult();
    expect(transactionResult2.status).toBe(TransactionStatus.success);

    // Change implementation to registryContract
    const implementation2Call = await storage.functions
      .set_implementation({ bits: contracts.registry.id.toB256() })
      .txParams(txParams)
      .call();
    const { transactionResult: transactionResult3 } =
      await implementation2Call.waitForResult();
    const getImplementation2Call = await storage.functions
      .get_implementation()
      .txParams(txParams)
      .call();
    const { value: value2 } = await getImplementation2Call.waitForResult();
    expect(value2.bits).toBe(contracts.registry.id.toB256());
    expect(transactionResult3.status).toBe(TransactionStatus.success);

    try {
      // Try set implementation with fake wallet
      const implementationFn3 = await storage2.functions
        .set_implementation({ bits: testContract })
        .txParams(txParams)
        .call();

      const { transactionResult } = await implementationFn3.waitForResult();

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expectRequireRevertError(e);
    }
  });

  it('should try change owner of storage', async () => {
    const walletFake = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);
    await fundWallet(walletFake);

    const storage = { ...contracts.storage };
    const storage2 = storage.connect(walletFake);

    await tryExecute(storage.initializeStorage());

    // Change owner to walletFake
    const ownerFn = await storage.functions
      .set_owner({ bits: walletFake.address.toB256() })
      .txParams(txParams)
      .call();
    const { transactionResult } = await ownerFn.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);

    // Change owner to main wallet
    const owner2Fn = await storage2.functions
      .set_owner({ bits: wallet.address.toB256() })
      .txParams(txParams)
      .call();
    const { transactionResult: transactionResult2 } =
      await owner2Fn.waitForResult();
    expect(transactionResult2.status).toBe(TransactionStatus.success);

    // Get owner from storage contract
    const owner3 = await storage.functions
      .get_owner()
      .txParams(txParams)
      .call();
    const { transactionResult: transactionResult3, value: storageOwner } =
      await owner3.waitForResult();
    expect(transactionResult3.status).toBe(TransactionStatus.success);
    expect(storageOwner.bits).toBe(wallet.address.toB256());

    try {
      // Try change owner with other wallet
      await storage2.functions
        .set_owner({ bits: walletFake.address.toB256() })
        .txParams(txParams)
        .call();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expectRequireRevertError(e);
    }
  });
});
