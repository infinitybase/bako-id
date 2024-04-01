import { Address, Provider, RequireRevertError, TransactionStatus, WalletUnlocked } from 'fuels';
import { createWallet, randomName, setupContractsAndDeploy, tryExecute, txParams } from './utils';

describe('[METHODS] Test Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/graphql');
    wallet = createWallet(provider);
    contracts = await setupContractsAndDeploy(wallet);
  });

  it('should error on call method without a proxy contract started', async () => {
    const domain = randomName();
    const { registry, storage } = contracts;

    expect.assertions(2);

    try {
      await registry
        .functions
        .register(domain, wallet.address.toB256())
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      expect(e.cause.logs[0]).toBe('StorageNotInitialized');
    }
  });

  it('should error to initialize proxy contract when proxy already initialized', async () => {
    const { registry } = contracts;

    await tryExecute(registry.initializeRegistry());

    try {
      const { txRegistry: txRegistryFailure } = await registry.initializeRegistry();
      expect(txRegistryFailure.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      expect(e.cause.logs[0]).toBe('AlreadyInitialized');
    }
  });

  it('should dont register domain when not available', async () => {
    const { registry, storage } = contracts;

    const domain = randomName();
    await tryExecute(storage.initializeStorage());

    try {
      await registry.register(domain, wallet.address.toB256());

      const { transactionResult: txRegister } = await registry
        .register(domain, wallet.address.toB256());

      expect(txRegister.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expect(e).toBeInstanceOf(RequireRevertError);
      expect(e.cause.logs[0]).toBe('DomainNotAvailable');
    }
  });

  it('should create domain register and get resolver', async () => {
    const { registry, storage } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());

    const domain = randomName();
    const { transactionResult: txRegister } = await registry
      .register(domain, wallet.address.toB256());

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
    const { registry, storage } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());

    const domain = randomName();
    await registry.register(domain, wallet.address.toB256());

    const wrongDomain = randomName();
    const { value } = await registry
      .functions
      .resolver(wrongDomain)
      .txParams(txParams)
      .call();

    expect(value).toBe(undefined);
  });

  it('should error resolver without being register', async () => {
    const { registry, storage } = contracts;
    const domain = randomName();

    const { value } = await registry
      .functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(value).toBeUndefined();
  });

  it('should get name by resolver', async () => {
    const { registry, storage } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());

    const address = wallet.address;

    const domain = 'luisburigo';
    await registry.register(domain, address.toB256());

    const { value } = await registry
      .functions
      .reverse_name(address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(value).toBe(domain);
  });

  it('should empty name when not found handle', async () => {
    const { registry, storage } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());

    const address = wallet.address;

    await registry.register(randomName(), address.toB256());

    const { value } = await registry
      .functions
      .reverse_name(Address.fromRandom().toB256())
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(value).toBe('');
  });

  it('should get primary domain', async () => {
    const { registry, storage } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());

    const address = wallet.address.toB256();

    const [primaryDomain, secondaryDomain] = [randomName(), randomName()];
    await registry.register(primaryDomain, address);
    await registry.register(secondaryDomain, address);

    const { value } = await registry
      .functions
      .reverse_name(address)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(value).toBe(primaryDomain);
  });
});
