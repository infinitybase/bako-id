import { bn } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  Manager,
  ManagerFactory,
  RegistryFactory,
  ResolverFactory,
} from '../src';
import {
  expectContainLogError,
  expectRequireRevertError,
  randomName,
} from './utils';

describe('[METHODS] Resolver Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let manager: Manager;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: ManagerFactory },
        { factory: RegistryFactory },
        { factory: ResolverFactory },
      ],
    });

    const {
      contracts: [managerAbi, _registryAbi, _resolverAbi],
      wallets: [deployer],
    } = node;

    manager = new Manager(managerAbi.id, deployer);

    const managerConstructor = await manager.functions
      .constructor({ Address: { bits: deployer.address.toB256() } })
      .call();
    await managerConstructor.waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error on call method with contract not started', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    const { waitForResult: waitForManager } =
      await ManagerFactory.deploy(owner);
    const { contract: manager } = await waitForManager();

    expect.assertions(2);

    try {
      await manager.functions
        .set_resolver(domain, { Address: { bits: owner.address.toB256() } })
        .call();
    } catch (error) {
      expectContainLogError(error, 'ContractNotInitialized');
      expectRequireRevertError(error);
    }
  });

  it('should error on set record when not owner', async () => {
    const [owner, notOwner] = node.wallets;
    const domain = randomName();

    const { waitForResult } = await manager.functions
      .set_record(domain, {
        owner: { Address: { bits: owner.address.toB256() } },
        resolver: { Address: { bits: owner.address.toB256() } },
        period: bn(1),
        timestamp: bn(1),
      })
      .call();
    await waitForResult();

    expect.assertions(2);

    try {
      const managerNotOwner = new Manager(manager.id, notOwner);
      const { waitForResult: waitForResult1 } = await managerNotOwner.functions
        .set_record(domain, {
          owner: { Address: { bits: owner.address.toB256() } },
          resolver: { Address: { bits: owner.address.toB256() } },
          period: bn(1),
          timestamp: bn(1),
        })
        .call();
      await waitForResult1();
    } catch (e) {
      expectContainLogError(e, 'OnlyOwner');
      expectRequireRevertError(e);
    }
  });

  it('should set a record correctly', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    const recordInput = {
      owner: { Address: { bits: owner.address.toB256() } },
      resolver: { Address: { bits: owner.address.toB256() } },
      period: bn(1),
      timestamp: bn(1),
    };
    const { waitForResult } = await manager.functions
      .set_record(domain, recordInput)
      .call();
    await waitForResult();

    const { value: record } = await manager.functions.get_record(domain).get();

    expect(record?.owner.Address?.bits).toBe(recordInput.owner.Address.bits);
    expect(record?.resolver.Address?.bits).toBe(
      recordInput.resolver.Address.bits
    );
    expect(record?.period.toString()).toBe(recordInput.period.toString());
    expect(record?.timestamp.toString()).toBe(recordInput.timestamp.toString());
  });

  it('should set a resolver correctly', async () => {
    const [owner, newResolver] = node.wallets;
    const domain = randomName();

    const recordInput = {
      owner: { Address: { bits: owner.address.toB256() } },
      resolver: { Address: { bits: owner.address.toB256() } },
      period: bn(1),
      timestamp: bn(1),
    };
    const { waitForResult } = await manager.functions
      .set_record(domain, recordInput)
      .call();
    await waitForResult();

    const { waitForResult: waitForResult1 } = await manager.functions
      .set_resolver(domain, { Address: { bits: newResolver.address.toB256() } })
      .call();
    await waitForResult1();

    const { value: resolverAddress } = await manager.functions
      .get_resolver(domain)
      .get();
    expect(resolverAddress?.Address?.bits).toBe(newResolver.address.toB256());
  });

  it('should get a record infos correctly', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    const recordInput = {
      owner: { Address: { bits: owner.address.toB256() } },
      resolver: { Address: { bits: owner.address.toB256() } },
      period: bn(1),
      timestamp: bn(1),
    };
    const { waitForResult } = await manager.functions
      .set_record(domain, recordInput)
      .call();
    await waitForResult();

    const { value: name } = await manager.functions
      .get_name(recordInput.resolver)
      .get();
    const { value: ownerAddress } = await manager.functions
      .get_owner(domain)
      .get();
    const { value: resolverAddress } = await manager.functions
      .get_resolver(domain)
      .get();
    const { value: ttl } = await manager.functions.get_ttl(domain).get();

    expect(name).toBe(domain);
    expect(ownerAddress?.Address?.bits).toBe(owner.address.toB256());
    expect(resolverAddress?.Address?.bits).toBe(owner.address.toB256());
    expect(ttl).toBeDefined();
  });
});
