import { Provider, type WalletUnlocked } from 'fuels';
import {
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
  setupContractsAndDeploy,
  tryExecute,
  txParams,
} from './utils';

describe('[METHODS] Resolver Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/graphql');
    wallet = createWallet(provider);
    contracts = await setupContractsAndDeploy(wallet);
  });

  it('should error on call method with contract not started', async () => {
    const domain = randomName();
    const { resolver, storage } = contracts;

    expect.assertions(2);

    try {
      await resolver.functions
        .resolver(domain)
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'StorageNotInitialized');
    }
  });

  it('should undefined resolver, owner and name with not registered handle', async () => {
    const domain = randomName();
    const { resolver, storage } = contracts;

    await tryExecute(resolver.initializeResolver());
    await tryExecute(storage.initializeStorage());

    const { value: resolverAddress } = await resolver.functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(resolverAddress).toBeUndefined();

    const { value: ownerAddress } = await resolver.functions
      .owner(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(ownerAddress).toBeUndefined();

    const { value: resolverName } = await resolver.functions
      .name(wallet.address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(resolverName).toBe('');
  });

  it('should get owner, resolver and name', async () => {
    const domain = randomName();
    const { resolver, storage, registry } = contracts;

    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());
    await tryExecute(storage.initializeStorage());

    const b256Address = wallet.address.toB256();
    await registry.register(domain, b256Address);

    const { value: resolverAddress } = await resolver.functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(resolverAddress).toBe(b256Address);

    const { value: ownerAddress } = await resolver.functions
      .owner(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(ownerAddress).toBe(b256Address);

    const { value: resolverName } = await resolver.functions
      .name(b256Address)
      .addContracts([storage])
      .txParams(txParams)
      .call();

    expect(resolverName).toBe(domain);
  });
});
