import { Provider, type WalletUnlocked, ZeroBytes32 } from 'fuels';
import {
  TestRegistryContract,
  TestResolverContract,
  TestStorageContract,
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
  txParams,
} from './utils';

describe('[METHODS] Resolver Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider);
  });

  it('should error on call method with contract not started', async () => {
    const domain = randomName();

    const resolver = await TestResolverContract.deploy(wallet);
    const storage = await TestStorageContract.deploy(wallet);

    expect.assertions(2);

    try {
      await resolver.functions.resolver(domain).addContracts([storage]).call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'StorageNotInitialized');
    }
  });

  it('should undefined resolver, owner and name with not registered handle', async () => {
    const domain = randomName();

    const storage = await TestStorageContract.deploy(wallet);
    const resolver = await TestResolverContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
    });

    const { value: resolverAddress } = await resolver.functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .get();
    expect(resolverAddress).toBeUndefined();

    const { value: ownerAddress } = await resolver.functions
      .owner(domain)
      .addContracts([storage])
      .txParams(txParams)
      .get();
    expect(ownerAddress).toBeUndefined();

    const { value: resolverName } = await resolver.functions
      .name(wallet.address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .get();
    expect(resolverName).toBe('');
  });

  it('should get owner, resolver and name', async () => {
    const domain = randomName();

    const storage = await TestStorageContract.deploy(wallet);
    const registry = await TestRegistryContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
    const resolver = await TestResolverContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
    });
    await storage.initialize(wallet, registry.id.toB256());

    const b256Address = wallet.address.toB256();
    await registry.register({
      domain,
      period: 1,
      address: b256Address,
      storageAbi: storage,
    });

    const { value: resolverAddress } = await resolver.functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .get();
    expect(resolverAddress).toBe(b256Address);

    const { value: ownerAddress } = await resolver.functions
      .owner(domain)
      .addContracts([storage])
      .txParams(txParams)
      .get();
    expect(ownerAddress).toBe(b256Address);

    const { value: resolverName } = await resolver.functions
      .name(b256Address)
      .addContracts([storage])
      .txParams(txParams)
      .get();
    expect(resolverName).toBe(domain);
  });
});
