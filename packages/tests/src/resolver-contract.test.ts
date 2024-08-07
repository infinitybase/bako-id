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
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider);
    contracts = await setupContractsAndDeploy(wallet);
  });

  it('should error on call method with contract not started', async () => {
    const domain = randomName();
    const { resolver, storage } = contracts;

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
    const { resolver, storage } = contracts;

    await tryExecute(resolver.initializeResolver());
    await tryExecute(storage.initializeStorage());

    const resolverFn = await resolver.functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();
    const { value: resolverAddress } = await resolverFn.waitForResult();

    expect(resolverAddress).toBeUndefined();

    const ownerFn = await resolver.functions
      .owner(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();
    const { value: ownerAddress } = await ownerFn.waitForResult();
    expect(ownerAddress).toBeUndefined();

    const nameFn = await resolver.functions
      .name(wallet.address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .call();
    const { value: resolverName } = await nameFn.waitForResult();
    expect(resolverName).toBe('');
  });

  it('should get owner, resolver and name', async () => {
    const domain = randomName();
    const { resolver, storage, registry } = contracts;

    await tryExecute(registry.initializeRegistry());
    await tryExecute(resolver.initializeResolver());
    await tryExecute(storage.initializeStorage());

    const b256Address = wallet.address.toB256();
    await registry.register(domain, b256Address, 1);

    const resolveerFn = await resolver.functions
      .resolver(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();
    const { value: resolverAddress } = await resolveerFn.waitForResult();
    expect(resolverAddress).toBe(b256Address);

    const ownerFn = await resolver.functions
      .owner(domain)
      .addContracts([storage])
      .txParams(txParams)
      .call();
    const { value: ownerAddress } = await ownerFn.waitForResult();
    expect(ownerAddress).toBe(b256Address);

    const nameFn = await resolver.functions
      .name(b256Address)
      .addContracts([storage])
      .txParams(txParams)
      .call();
    const { value: resolverName } = await nameFn.waitForResult();
    expect(resolverName).toBe(domain);
  });
});
