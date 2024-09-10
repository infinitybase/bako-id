import {
  Address,
  Provider,
  TransactionStatus,
  type WalletUnlocked,
  ZeroBytes32,
  bn,
} from 'fuels';
import {
  TestRegistryContract,
  TestResolverContract,
  TestStorageContract,
  WALLET_PRIVATE_KEYS,
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  fundWallet,
  randomName,
  txParams,
} from './utils';

describe('[METHODS] Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let storage: TestStorageContract;
  let registry: TestRegistryContract;
  let resolver: TestResolverContract;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider);
    storage = await TestStorageContract.deploy(wallet);
    registry = await TestRegistryContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
    resolver = await TestResolverContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
    });
    await storage.initialize(wallet, registry.id.toB256());
  });

  it('should error on call method without a proxy contract started', async () => {
    const domain = randomName();

    const storage = await TestStorageContract.deploy(wallet);
    const registry = await TestRegistryContract.deploy(wallet);

    expect.assertions(2);

    try {
      const callFn = await registry.functions
        .register(domain, wallet.address.toB256(), 1)
        .addContracts([storage])
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'StorageNotInitialized');
    }
  });

  it('should register domain with 1 year', async () => {
    const domain = randomName();

    const { transactionResult: txRegister } = await registry.register({
      domain,
      period: 1,
      storageAbi: storage,
    });

    expect(txRegister.status).toBe(TransactionStatus.success);
  });

  it('should register domain with 2 years', async () => {
    const domain = randomName();

    const { transactionResult: txRegister } = await registry.register({
      domain,
      period: 2,
      storageAbi: storage,
    });

    expect(txRegister.status).toBe(TransactionStatus.success);
  });

  it('should register domain with 3 years', async () => {
    const domain = randomName();

    const { transactionResult: txRegister } = await registry.register({
      domain,
      period: 3,
      storageAbi: storage,
    });

    expect(txRegister.status).toBe(TransactionStatus.success);
  });

  it('should error to initialize proxy contract when proxy already initialized', async () => {
    try {
      const { transactionResult } = await registry.initialize({
        owner: wallet,
        storageId: storage.id.toB256(),
        attestationId: ZeroBytes32,
      });
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'AlreadyInitialized');
    }
  });

  it('should dont register domain when not available', async () => {
    const domain = randomName();

    try {
      await registry.register({
        domain,
        period: 1,
        storageAbi: storage,
      });

      const { transactionResult } = await registry.register({
        domain,
        period: 1,
        storageAbi: storage,
      });

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'DomainNotAvailable');
    }
  });

  it('should create domain register and get resolver', async () => {
    const domain = randomName();

    await registry.register({
      domain,
      period: 1,
      storageAbi: storage,
    });

    const { value } = await resolver.functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .get();

    expect(value).toBe(wallet.address.toB256());
  });

  it('should error register and get resolver with other domain', async () => {
    const domain = randomName();
    await registry.register({
      domain,
      period: 1,
      storageAbi: storage,
    });

    const wrongDomain = randomName();
    const { value } = await resolver.functions
      .resolver(wrongDomain)
      .txParams(txParams)
      .get();

    expect(value).toBe(undefined);
  });

  it('should get primary domain', async () => {
    const address = Address.fromRandom().toB256();

    const [primaryDomain, secondaryDomain] = [randomName(), randomName()];
    await registry.register({
      domain: primaryDomain,
      period: 1,
      storageAbi: storage,
      address,
    });
    await registry.register({
      domain: secondaryDomain,
      period: 1,
      storageAbi: storage,
      address,
    });

    const { value } = await resolver.functions
      .name(address)
      .addContracts([storage])
      .txParams(txParams)
      .get();

    expect(value).toBe(primaryDomain);
  });

  it('should get all handles by owner address', async () => {
    const address = Address.fromRandom().toB256();
    const handles = [randomName(), randomName(), randomName()];

    const storage = await TestStorageContract.deploy(wallet);
    const registry = await TestRegistryContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
    await storage.initialize(wallet, registry.id.toB256());

    for (const handle of handles) {
      await registry.register({
        domain: handle,
        period: 1,
        storageAbi: storage,
        address,
      });
    }

    const { value: vecBytes } = await registry.functions
      .get_all(wallet.address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .get();

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
    const address = Address.fromRandom().toB256();

    const domain = randomName();
    await registry.register({
      domain,
      address,
      period: 1,
      storageAbi: storage,
    });

    const { value } = await registry.functions
      .get_grace_period(domain)
      .addContracts([storage])
      .txParams(txParams)
      .get();

    expect(value).toEqual({
      grace_period: bn(value.grace_period),
      timestamp: bn(value.timestamp),
      period: bn(value.period),
    });
  });

  it.each(['@invalid-!@#%$!', 'my@asd.other', '@MYHanDLE'])(
    'should throw a error when try register %s',
    async (handle) => {
      const register = (name: string) =>
        registry.register({
          domain: name,
          period: 1,
          storageAbi: storage,
        });

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

  it('should be able to edit resolver of a domain', async () => {
    const domain = randomName();

    const newAddress = Address.fromRandom().toB256();
    await registry.register({
      domain,
      period: 1,
      storageAbi: storage,
    });

    const editFn = await registry.functions
      .edit_resolver(domain, newAddress)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    const { transactionResult: txResolver } = await editFn.waitForResult();

    const { value } = await resolver.functions.resolver(domain).get();

    expect(value).toBe(newAddress);
    expect(txResolver.status).toBe(TransactionStatus.success);
  });

  it('should not be able to edit resolver of a domain if domain it is not registered', async () => {
    const domain = randomName();
    const newAddress = Address.fromRandom().toB256();

    try {
      const callFn = await registry.functions
        .edit_resolver(domain, newAddress)
        .addContracts([storage])
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'InvalidDomain');
    }
  });

  it('should throw error if try to edit resolver with same address', async () => {
    const domain = randomName();
    const newAddress = wallet.address.toB256();

    await registry.register({
      domain,
      period: 1,
      storageAbi: storage,
    });

    try {
      const callFn = await registry.functions
        .edit_resolver(domain, newAddress)
        .addContracts([storage])
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'SameResolver');
    }
  });

  it('should not be able to edit resolver of a domain if not owner', async () => {
    const fakeWallet = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);
    await fundWallet(wallet);

    const domain = randomName();
    await registry.register({
      domain,
      period: 1,
      storageAbi: storage,
    });

    const newAddress = Address.fromRandom().toB256();

    try {
      registry.account = fakeWallet;

      const callFn = await registry.functions
        .edit_resolver(domain, newAddress)
        .addContracts([storage])
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'NotOwner');
    } finally {
      registry.account = wallet;
    }
  });

  it('should be able to set a domain as primary', async () => {
    const domain = randomName();
    const secondaryDomain = randomName();
    const address = Address.fromRandom().toB256();

    await registry.register({
      domain,
      address,
      period: 1,
      storageAbi: storage,
    });

    await registry.register({
      domain: secondaryDomain,
      address,
      period: 1,
      storageAbi: storage,
    });

    const registryFn = await registry.functions
      .set_primary_handle(secondaryDomain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    const value = await registryFn.waitForResult();

    expect(value.transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should not be able to set a domain as primary if not owner', async () => {
    const fakeWallet = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);

    const domain = randomName();
    const secondaryDomain = randomName();
    const address = Address.fromRandom().toB256();

    await registry.register({
      domain,
      address,
      period: 1,
      storageAbi: storage,
    });

    await registry.register({
      domain: secondaryDomain,
      address,
      period: 1,
      storageAbi: storage,
    });

    try {
      registry.account = fakeWallet;

      const callFn = await registry.functions
        .set_primary_handle(secondaryDomain)
        .addContracts([storage])
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'NotOwner');
    }
  });

  it('should not be able to set a domain as primary if domain not registered', async () => {
    const domain = randomName();
    const secondaryDomain = randomName();
    const address = Address.fromRandom().toB256();

    await registry.register({
      domain,
      address,
      period: 1,
      storageAbi: storage,
    });

    try {
      const callFn = await registry.functions
        .set_primary_handle(secondaryDomain)
        .addContracts([storage])
        .call();

      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'InvalidDomain');
    }
  });
});
