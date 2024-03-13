import { hash, Provider, RequireRevertError, TransactionStatus } from 'fuels';
import {
  createWallet,
  storageContract,
  registryContract,
  setupContracts,
  testContract,
  tryExecute,
  txParams,
  WALLET_PRIVATE_KEYS, setupContractsAndDeploy
} from './utils';

describe('Test Storage Contract', () => {
  let provider: Provider;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/graphql');
  });

  it('should error on call method without a storage contract started', async () => {
    const wallet = createWallet(provider);
    const { storage } = await setupContractsAndDeploy(wallet);

    try {
      await storage.functions.set(hash(Buffer.from('20')), [10, 10]).txParams(txParams).call();
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      expect(e.cause.logs[0].Unauthorized).toBeDefined();
    }
  });

  it('should error on call storage by other contract', async () => {
    const wallet = createWallet(provider);
    const { storage, testCaller } = await setupContracts(wallet);

    await tryExecute(storage.initializeStorage());

    try {
      await testCaller.functions.test_set({
        value: storageContract
      }).addContracts([storage]).txParams(txParams).call();
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      expect(e.cause.logs[0].Unauthorized).toBeDefined();
    }
  });

  it('should error on initialize storage when already initialized', async () => {
    const wallet = createWallet(provider);
    const { storage } = await setupContracts(wallet);

    await tryExecute(storage.initializeStorage());

    try {
      const { txProxy } = await storage.initializeStorage();

      expect(txProxy.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      // expect(e.cause.logs[0]).toBe("NotOwner");
    }
  });

  it('should get contract implementation', async () => {
    const wallet = createWallet(provider);
    const { storage } = await setupContracts(wallet);

    await tryExecute(storage.initializeStorage());

    const { transactionResult, value } = await storage.functions.get_implementation().txParams(txParams).call();

    expect(transactionResult.status).toBe(TransactionStatus.success);
    expect(value.value).toBe(registryContract);
  });

  it('should error on change contract implementation', async () => {
    const wallet = createWallet(provider);
    const walletFake = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);
    const { storage, testCaller } = await setupContracts(wallet);

    await tryExecute(storage.initializeStorage());

    const { storage: storage2 } = await setupContracts(walletFake);

    // Change implementation to testContract
    const {
      transactionResult
    } = await storage.functions.set_implementation({ value: testContract }).txParams(txParams).call();
    const { value } = await storage.functions.get_implementation().txParams(txParams).call();
    expect(value.value).toBe(testContract);
    expect(transactionResult.status).toBe(TransactionStatus.success);

    // Execute method in testContract
    const { transactionResult: transactionResult2 } = await testCaller.functions.test_set({
      value: storageContract
    }).txParams(txParams).call();
    expect(transactionResult2.status).toBe(TransactionStatus.success);

    // Change implementation to registryContract
    const { transactionResult: transactionResult3 } = await storage.functions.set_implementation({ value: registryContract }).txParams(txParams).call();
    const { value: value2 } = await storage.functions.get_implementation().txParams(txParams).call();
    expect(value2.value).toBe(registryContract);
    expect(transactionResult3.status).toBe(TransactionStatus.success);

    try {
      // Try set implementation with fake wallet
      const {
        transactionResult
      } = await storage2.functions.set_implementation({ value: testContract }).txParams(txParams).call();

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      // expect(e.cause.logs[0]).toBe("NotOwner");
    }
  });

  it('should try change owner of storage', async () => {
    const wallet = createWallet(provider);
    const walletFake = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);

    const { storage } = await setupContracts(wallet);

    await tryExecute(storage.initializeStorage());

    const { storage: storage2 } = await setupContracts(walletFake);

    // Change owner to walletFake
    const {
      transactionResult
    } = await storage.functions.set_owner({ value: walletFake.address.toB256() }).txParams(txParams).call();
    expect(transactionResult.status).toBe(TransactionStatus.success);

    // Change owner to main wallet
    const {
      transactionResult: transactionResult2
    } = await storage2.functions.set_owner({ value: wallet.address.toB256() }).txParams(txParams).call();
    expect(transactionResult2.status).toBe(TransactionStatus.success);

    // Get owner from storage contract
    const {
      value: storageOwner
    } = await storage.functions.get_owner().txParams(txParams).call();
    expect(transactionResult.status).toBe(TransactionStatus.success);
    expect(storageOwner.value).toBe(wallet.address.toB256());

    try {
      // Try change owner with other wallet
      await storage2.functions.set_owner({ value: walletFake.address.toB256() }).txParams(txParams).call();
      expect(transactionResult.status).toBe(TransactionStatus.success);
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
    }
  });

});
