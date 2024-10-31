import { ZeroBytes32 } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  RegistryContractFactory,
  ResolverContractFactory,
  StorageContractFactory,
} from '../src';
import {
  TestRegistryContract,
  TestResolverContract,
  TestStorageContract,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
  txParams,
} from './utils';

describe('[METHODS] Resolver Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let storage: TestStorageContract;
  let registry: TestRegistryContract;
  let resolver: TestResolverContract;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: StorageContractFactory },
        { factory: RegistryContractFactory },
        { factory: ResolverContractFactory },
      ],
    });

    const {
      contracts: [storageAbi, registryAbi, resolverAbi],
      wallets: [deployer],
    } = node;

    storage = new TestStorageContract(storageAbi.id, deployer);
    registry = new TestRegistryContract(registryAbi.id, deployer);
    resolver = new TestResolverContract(resolverAbi.id, deployer);

    await storage.initialize(deployer, registry.id.toB256());
    await registry.initialize({
      owner: deployer,
      storageId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
    await resolver.initialize({ storageId: storage.id.toB256() });
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error on call method with contract not started', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    const resolver = await TestResolverContract.deploy(owner);
    const storage = await TestStorageContract.deploy(owner);

    expect.assertions(2);

    try {
      await resolver.functions.resolver(domain).addContracts([storage]).call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'StorageNotInitialized');
    }
  });

  it('should undefined resolver, owner and name with not registered handle', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    const storage = await TestStorageContract.deploy(owner);
    const resolver = await TestResolverContract.startup({
      owner,
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
      .name(owner.address.toB256())
      .addContracts([storage])
      .txParams(txParams)
      .get();
    expect(resolverName).toBe('');
  });

  it('should get owner, resolver and name', async () => {
    const [owner] = node.wallets;
    const domain = randomName();
    const b256Address = owner.address.toB256();

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
