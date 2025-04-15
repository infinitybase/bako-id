import { bn } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  Manager,
  ManagerFactory,
  Nft,
  NftFactory,
  Registry,
  RegistryFactory,
  Resolver,
  ResolverFactory,
} from '../src';
import {
  domainPrices,
  expectRequireRevertError,
  randomName,
  txParams,
} from './utils';

describe('[METHODS] Resolver Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let manager: Manager;
  let registry: Registry;
  let resolver: Resolver;
  let nft: Nft;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: ManagerFactory },
        { factory: RegistryFactory },
        { factory: ResolverFactory },
        { factory: NftFactory },
      ],
    });

    const {
      contracts: [managerAbi, registryAbi, resolverAbi, nftAbi],
      wallets: [owner],
    } = node;

    manager = new Manager(managerAbi.id, owner);
    registry = new Registry(registryAbi.id, owner);
    resolver = new Resolver(resolverAbi.id, owner);
    nft = new Nft(nftAbi.id, owner);

    const nftCall = await nft.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } },
      )
      .call();
    await nftCall.waitForResult();

    const registryContructor = await registry.functions
      .constructor(
        { bits: owner.address.toB256() },
        { bits: manager.id.toB256() },
        { bits: nft.id.toB256() },
      )
      .call();
    await registryContructor.waitForResult();

    const resolverConstructor = await resolver.functions
      .constructor({ bits: manager.id.toB256() })
      .call();
    await resolverConstructor.waitForResult();

    const managerConstructor = await manager.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } },
      )
      .call();
    await managerConstructor.waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error on call method with contract not started', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    const { waitForResult: waitForResolver } =
      await ResolverFactory.deploy(owner);
    const { contract: resolver } = await waitForResolver();

    expect.assertions(1);

    try {
      await resolver.functions.addr(domain).addContracts([manager]).call();
    } catch (error) {
      expectRequireRevertError(error);
    }
  });

  it('should undefined resolver, owner and name with not registered handle', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    const { value: resolverAddress } = await resolver.functions
      .addr(domain)
      .addContracts([manager])
      .txParams(txParams)
      .get();
    expect(resolverAddress).toBeUndefined();

    const { value: ownerAddress } = await resolver.functions
      .owner(domain)
      .addContracts([manager])
      .txParams(txParams)
      .get();
    expect(ownerAddress).toBeUndefined();

    const addressInput = { bits: owner.address.toB256() };
    const { value: resolverName } = await resolver.functions
      .name({ Address: addressInput })
      .addContracts([manager])
      .txParams(txParams)
      .get();
    expect(resolverName).toBeUndefined();
  });

  it('should get owner, resolver and name', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;
    const name = randomName();
    const b256Address = owner.address.toB256();

    const price = domainPrices(name);

    const { waitForResult: waitForRegister } = await registry.functions
      .register(
        name,
        {
          Address: { bits: owner.address.toB256() },
        },
        bn(1),
      )
      .callParams({
        forward: { assetId: await provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager, nft])
      .call();
    await waitForRegister();

    const { value: resolverAddress } = await resolver.functions
      .addr(name)
      .addContracts([manager])
      .txParams(txParams)
      .get();
    expect(resolverAddress?.Address?.bits).toBe(b256Address);

    const { value: ownerAddress } = await resolver.functions
      .owner(name)
      .addContracts([manager])
      .txParams(txParams)
      .get();
    expect(ownerAddress?.Address?.bits).toBe(b256Address);

    const { value: resolverName } = await resolver.functions
      .name({ Address: { bits: b256Address } })
      .addContracts([manager])
      .txParams(txParams)
      .get();
    expect(resolverName).toBe(name);
  });
});
