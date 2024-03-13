import { Provider, RequireRevertError, TransactionStatus } from 'fuels';
import { setupContracts, randomName, createWallet, txParams, tryExecute, setupContractsAndDeploy } from './utils';

describe('Test Registry Contract', () => {
  let provider: Provider;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/graphql');
  });

  it('should error on call method without a proxy contract started', async () => {
    const wallet = createWallet(provider);
    const domain = randomName();
    const { registry, storage } = await setupContractsAndDeploy(wallet);

    try {
      const { transactionResult: txRegister } = await registry
        .functions
        .register(domain, wallet.address.toB256())
        .addContracts([storage])
        .txParams(txParams)
        .call();

      expect(txRegister.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      expect(e.cause.logs[0]).toBe("StorageNotInitialized");
    }
  });

  it('should error to initialize proxy contract when proxy already initialized',  async () => {
    const wallet = createWallet(provider);
    const { registry } = await setupContracts(wallet);

    await tryExecute(registry.initializeRegistry());

    try {
      const { txRegistry: txRegistryFailure } = await registry.initializeRegistry();
      expect(txRegistryFailure.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      expect(e.cause.logs[0]).toBe("AlreadyInitialized");
    }
  });

  it('should dont register domain when not available', async () => {
    const wallet = createWallet(provider);
    const { registry, storage } = await setupContracts(wallet);

    const domain = randomName();

    await tryExecute(storage.initializeStorage());

    try {
      await registry
        .functions
        .register(domain, wallet.address.toB256())
        .addContracts([storage])
        .txParams(txParams)
        .call();

      const { transactionResult: txRegister } = await registry
        .functions
        .register(domain, wallet.address.toB256())
        .addContracts([storage])
        .txParams(txParams)
        .call();

      expect(txRegister.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      expect(e.cause.logs[0]).toBe("DomainNotAvailable");
    }
  });

  it('should create domain register and get resolver', async () => {
    const wallet = createWallet(provider);
    const { registry, storage } = await setupContracts(wallet);

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());

    const domain = randomName();
    const { transactionResult: txRegister } = await registry
      .functions
      .register(domain, wallet.address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .call();

    const { value } = await registry
      .functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(value.resolver).toBe(wallet.address.toB256());
    expect(txRegister.status).toBe('success');
  });

  it('should error register and get resolver with other domain', async () => {
    const wallet = createWallet(provider);
    const { registry, storage } = await setupContracts(wallet);

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());

    const domain = randomName();
    await registry
      .functions
      .register(domain, wallet.address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .call();

    const wrongDomain = randomName();
    const { value } = await registry
      .functions
      .resolver(wrongDomain)
      .txParams(txParams)
      .call();

    expect(value).toBe(undefined);
  });

  it('should error resolver without being register', async () => {
    const wallet = createWallet(provider);
    const { registry, storage } = await setupContracts(wallet);
    const domain = randomName();

    const { value } = await registry
      .functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(value).toBeUndefined();
  });
});
