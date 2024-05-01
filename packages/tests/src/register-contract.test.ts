import {
  Address,
  Provider,
  TransactionStatus,
  type WalletUnlocked,
} from 'fuels';
import {
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
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
    provider = await Provider.create('http://localhost:4000/graphql');
    wallet = createWallet(provider);
    contracts = await setupContractsAndDeploy(wallet);
  });

  it('should error on call method without a proxy contract started', async () => {
    const domain = randomName();
    const { registry, storage } = contracts;

    expect.assertions(2);

    try {
      await registry.functions
        .register(domain, wallet.address.toB256())
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'StorageNotInitialized');
    }
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
      await registry.register(domain, wallet.address.toB256());

      const { transactionResult: txRegister } = await registry.register(
        domain,
        wallet.address.toB256()
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
      wallet.address.toB256()
    );

    const { value } = await resolver.functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(value).toBe(wallet.address.toB256());
    expect(txRegister.status).toBe('success');
  });

  it('should error register and get resolver with other domain', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const domain = randomName();
    await registry.register(domain, wallet.address.toB256());

    const wrongDomain = randomName();
    const { value } = await resolver.functions
      .resolver(wrongDomain)
      .txParams(txParams)
      .call();

    expect(value).toBe(undefined);
  });

  it('should get primary domain', async () => {
    const { registry, storage, resolver } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());

    const address = Address.fromRandom().toB256();

    const [primaryDomain, secondaryDomain] = [randomName(), randomName()];
    await registry.register(primaryDomain, address);
    await registry.register(secondaryDomain, address);

    const { value } = await resolver.functions
      .name(address)
      .addContracts([storage])
      .txParams(txParams)
      .call();

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
    await registry.register(handles[0], address);
    await registry.register(handles[1], address);
    await registry.register(handles[2], address);

    const { value: vecBytes } = await registry.functions
      .get_all(wallet.address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .call();

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

  it.each(['@invalid-!@#%$!', 'my@asd.other', '@MYHanDLE'])(
    'should throw a error when try register %s',
    async (handle) => {
      const { registry, storage } = await setupContractsAndDeploy(wallet);

      await tryExecute(registry.initializeRegistry());
      await tryExecute(storage.initializeStorage());

      const register = (name: string) =>
        registry.register(name, wallet.address.toB256());

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
    }
  );
});
