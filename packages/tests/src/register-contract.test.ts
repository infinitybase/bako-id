import {
  Address,
  Provider,
  TransactionStatus,
  bn,
  type WalletUnlocked,
} from 'fuels';
import {
  WALLET_PRIVATE_KEYS,
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  fundWallet,
  randomName,
  setupContractsAndDeploy,
  tryExecute,
  txParams,
} from './utils';

describe('[METHODS] Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider, WALLET_PRIVATE_KEYS.MAIN);
    contracts = await setupContractsAndDeploy(wallet);

    await fundWallet(wallet);
  });

  it('should error on call method without a proxy contract started', async () => {
    const domain = randomName();
    const { registry, storage } = contracts;

    expect.assertions(2);

    try {
      await registry.functions
        .register(domain, wallet.address.toB256(), 1)
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'StorageNotInitialized');
    }
  });

  it('should register domain with 1 year', async () => {
    const { registry, storage } = contracts;

    const domain = randomName();
    await tryExecute(registry.initializeRegistry());
    await tryExecute(storage.initializeStorage());

    const { transactionResult: txRegister } = await registry.register(
      domain,
      wallet.address.toB256(),
      1,
    );

    expect(txRegister.status).toBe(TransactionStatus.success);
  });

  it('should register domain with 2 years', async () => {
    const { registry, storage } = contracts;

    const domain = randomName();
    await tryExecute(registry.initializeRegistry());
    await tryExecute(storage.initializeStorage());

    const { transactionResult: txRegister } = await registry.register(
      domain,
      wallet.address.toB256(),
      2,
    );

    expect(txRegister.status).toBe(TransactionStatus.success);
  });
  it('should register domain with 3 years', async () => {
    const { registry, storage } = contracts;

    const domain = randomName();
    await tryExecute(registry.initializeRegistry());
    await tryExecute(storage.initializeStorage());

    const { transactionResult: txRegister } = await registry.register(
      domain,
      wallet.address.toB256(),
      3,
    );

    expect(txRegister.status).toBe(TransactionStatus.success);
  });

  it('should error to initialize proxy contract when proxy already initialized', async () => {
    const { registry } = contracts;

    await tryExecute(registry.initializeRegistry());

    try {
      const { txRegistry: txRegistryFailure } =
        await registry.initializeRegistry();
      expect(txRegistryFailure.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'AlreadyInitialized');
    }
  });

  it('should dont register domain when not available', async () => {
    const { registry, storage } = contracts;

    const domain = randomName();
    await tryExecute(registry.initializeRegistry());
    await tryExecute(storage.initializeStorage());

    try {
      await registry.register(domain, wallet.address.toB256(), 1);

      const { transactionResult: txRegister } = await registry.register(
        domain,
        wallet.address.toB256(),
        1,
      );

      expect(txRegister.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'DomainNotAvailable');
    }
  });

  it('should create domain register and get resolver', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const domain = randomName();
    const { transactionResult: txRegister } = await registry.register(
      domain,
      wallet.address.toB256(),
      1,
    );

    const resolverFn = await resolver.functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    const { value } = await resolverFn.waitForResult();

    expect(value).toBe(wallet.address.toB256());
    expect(txRegister.status).toBe('success');
  });

  it('should error register and get resolver with other domain', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const domain = randomName();
    await registry.register(domain, wallet.address.toB256(), 1);

    const wrongDomain = randomName();
    const resolverFn = await resolver.functions
      .resolver(wrongDomain)
      .txParams(txParams)
      .call();
    const { value } = await resolverFn.waitForResult();

    expect(value).toBe(undefined);
  });

  it('should get primary domain', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const address = Address.fromRandom().toB256();

    const [primaryDomain, secondaryDomain] = [randomName(), randomName()];
    await registry.register(primaryDomain, address, 1);
    await registry.register(secondaryDomain, address, 1);

    const nameFn = await resolver.functions
      .name(address)
      .addContracts([storage])
      .txParams(txParams)
      .call();
    const { value } = await nameFn.waitForResult();

    expect(value).toBe(primaryDomain);
  });

  it('should get all handles by owner address', async () => {
    const { registry, storage, resolver } =
      await setupContractsAndDeploy(wallet);

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const address = Address.fromRandom().toB256();
    const handles = [randomName(), randomName(), randomName()];

    await registry.register(handles[0], address, 1);
    await registry.register(handles[1], address, 1);
    await registry.register(handles[2], address, 1);

    const getAllFn = await registry.functions
      .get_all(wallet.address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .call();

    const { value: vecBytes } = await getAllFn.waitForResult();

    const expected = handles.flatMap((name, index) => {
      const size = name.length;
      // The first two bytes are the size of the string
      return [
        0,
        size,
        ...name.split('').map((char) => char.charCodeAt(0)),
        0,
        1,
        index === 0 ? 1 : 0,
      ];
    });

    expect(expected).toEqual(expect.arrayContaining(Array.from(vecBytes)));
  });

  it('should get timestamp by owner name', async () => {
    const { registry, storage, resolver } =
      await setupContractsAndDeploy(wallet);

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const address = Address.fromRandom().toB256();

    await registry.register('jonglazkov', address, 1);

    const periodFn = await registry.functions
      .get_grace_period('jonglazkov')
      .addContracts([storage])
      .txParams(txParams)
      .call();

    const { value } = await periodFn.waitForResult();

    expect(value).toEqual({
      grace_period: bn(value.grace_period),
      timestamp: bn(value.timestamp),
      period: bn(value.period),
    });
  });

  it.each(['@invalid-!@#%$!', 'my@asd.other', '@MYHanDLE'])(
    'should throw a error when try register %s',
    async (handle) => {
      const { registry, storage } = await setupContractsAndDeploy(wallet);

      await tryExecute(registry.initializeRegistry());
      await tryExecute(storage.initializeStorage());

      const register = (name: string) =>
        registry.register(name, wallet.address.toB256(), 1);

      const expectErrors = (error: unknown) => {
        expectRequireRevertError(error);
        expectContainLogError(error, 'InvalidChars');
      };

      expect.assertions(2);

      try {
        await register(handle);
      } catch (error) {
        expectErrors(error);
      }
    },
  );

  it('should be able to edit resolver of a domain', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const domain = randomName();

    const newAddress = Address.fromRandom().toB256();
    await registry.register(domain, wallet.address.toB256(), 1);

    const editFn = await registry.functions
      .edit_resolver(domain, newAddress)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    const { transactionResult: txResolver } = await editFn.waitForResult();

    const resolverFn = await resolver.functions.resolver(domain).call();
    const { value } = await resolverFn.waitForResult();

    expect(value).toBe(newAddress);
    expect(txResolver.status).toBe(TransactionStatus.success);
  });

  it('should not be able to edit resolver of a domain if domain it is not registered', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const domain = randomName();
    const newAddress = Address.fromRandom().toB256();

    try {
      await registry.functions
        .edit_resolver(domain, newAddress)
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'InvalidDomain');
    }
  });

  it('should throw error if try to edit resolver with same address', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const domain = randomName();
    const newAddress = wallet.address.toB256();

    await registry.register(domain, wallet.address.toB256(), 1);

    try {
      await registry.functions
        .edit_resolver(domain, newAddress)
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'SameResolver');
    }
  });

  it('should not be able to edit resolver of a domain if not owner', async () => {
    const { registry, storage, resolver } = contracts;

    const fakeWallet = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const domain = randomName();
    await registry.register(domain, wallet.address.toB256(), 1);

    const newAddress = Address.fromRandom().toB256();

    try {
      registry.account = fakeWallet;

      await registry.functions
        .edit_resolver(domain, newAddress)
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'NotOwner');
    }
  });

  it('should be able to set a domain as primary', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());
    fundWallet(wallet);

    const domain = randomName();
    const secondaryDomain = randomName();
    const address = Address.fromRandom().toB256();

    await registry.register(domain, address, 1);

    await registry.register(secondaryDomain, address, 1);

    const registryFn = await registry.functions
      .set_primary_handle(address, secondaryDomain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    const value = await registryFn.waitForResult();

    expect(value.transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should not be able to set a domain as primary if not owner', async () => {
    const { registry, storage, resolver } = contracts;

    const fakeWallet = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const domain = randomName();
    const secondaryDomain = randomName();
    const address = Address.fromRandom().toB256();

    await registry.register(domain, address, 1);

    await registry.register(secondaryDomain, address, 1);

    try {
      registry.account = fakeWallet;

      await registry.functions
        .set_primary_handle(address, secondaryDomain)
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'NotOwner');
    }
  });

  it('should not be able to set a domain as primary if domain not registered', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const domain = randomName();
    const secondaryDomain = randomName();
    const address = Address.fromRandom().toB256();

    await registry.register(domain, address, 1);

    try {
      await registry.functions
        .set_primary_handle(address, secondaryDomain)
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'InvalidDomain');
    }
  });
});
