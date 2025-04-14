import { type Account, TransactionStatus, bn, getRandomB256 } from 'fuels';
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
      walletsConfig: { count: 4 },
      contractsConfigs: [
        { factory: ManagerFactory },
        { factory: RegistryFactory },
        { factory: ResolverFactory },
      ],
    });

    const {
      contracts: [managerAbi, _registryAbi, _resolverAbi],
      wallets: [deployer, admin],
    } = node;

    manager = new Manager(managerAbi.id, deployer);

    const managerConstructor = await manager.functions
      .constructor(
        { Address: { bits: deployer.address.toB256() } },
        { Address: { bits: admin.address.toB256() } }
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

    const { waitForResult: waitForManager } =
      await ManagerFactory.deploy(owner);
    const { contract: manager } = await waitForManager();

    expect.assertions(2);

    try {
      await manager.functions
        .set_resolver(domain, { Address: { bits: owner.address.toB256() } })
        .call();
    } catch (error) {
      console.log(error);
      expectContainLogError(error, 'ContractNotInitialized');
      expectRequireRevertError(error);
    }
  });

  it('should error on set record when not record owner', async () => {
    const notOwner = node.wallets.at(3)!;
    const domain = randomName();

    const { waitForResult } = await manager.functions
      .set_record(domain, {
        owner: { Address: { bits: notOwner.address.toB256() } },
        resolver: { Address: { bits: notOwner.address.toB256() } },
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
          owner: { Address: { bits: notOwner.address.toB256() } },
          resolver: { Address: { bits: notOwner.address.toB256() } },
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

    await expect(async () => {
      const { waitForResult: waitForResult1 } = await manager.functions
        .set_resolver(domain, {
          Address: { bits: newResolver.address.toB256() },
        })
        .call();
      await waitForResult1();
    }).rejects.toThrow(/ResolverAlreadyInUse/);
  });

  it('should get a record infos correctly', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    const recordInput = {
      owner: { Address: { bits: owner.address.toB256() } },
      resolver: { Address: { bits: getRandomB256() } },
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

    expect(name).toBe(domain);
    expect(ownerAddress?.Address?.bits).toBe(owner.address.toB256());
    expect(resolverAddress?.Address?.bits).toBe(
      recordInput.resolver.Address.bits
    );
  });

  it('should execute admin and owner methods correctly', async () => {
    const [owner, admin, newAdmin] = node.wallets;

    const connectManager = (account: Account) =>
      new Manager(manager.id, account);

    const registerRecord = async (manager: Manager) => {
      const domain = randomName();
      const recordInput = {
        owner: { Address: { bits: owner.address.toB256() } },
        resolver: { Address: { bits: getRandomB256() } },
        period: bn(1),
        timestamp: bn(1),
      };
      const { waitForResult } = await manager.functions
        .set_record(domain, recordInput)
        .call();
      return waitForResult();
    };

    const addAdmin = async (manager: Manager, admin: Account) => {
      const { waitForResult } = await manager.functions
        .add_admin({ Address: { bits: admin.address.toB256() } })
        .call();
      return waitForResult();
    };

    const revokeAdmin = async (manager: Manager, admin: Account) => {
      const { waitForResult } = await manager.functions
        .revoke_admin({ Address: { bits: admin.address.toB256() } })
        .call();
      return waitForResult();
    };

    const managerOwner = connectManager(owner);
    const managerAdmin = connectManager(admin);
    const managerNewAdmin = connectManager(newAdmin);

    // Execute correctly when admin and owner is connected in manager
    const ownerRegisterResult = await registerRecord(managerOwner);
    expect(ownerRegisterResult.transactionResult.status).toBe(
      TransactionStatus.success
    );

    const adminRegisterResult = await registerRecord(managerAdmin);
    expect(adminRegisterResult.transactionResult.status).toBe(
      TransactionStatus.success
    );

    // Only owner can add admin
    const ownerAddAdminResult = await addAdmin(managerOwner, newAdmin);
    expect(ownerAddAdminResult.transactionResult.status).toBe(
      TransactionStatus.success
    );

    await expect(() => addAdmin(managerAdmin, newAdmin)).rejects.toThrow(
      /NotOwner/
    );

    // Only owner can revoke admin
    const ownerRevokeCall = await revokeAdmin(managerOwner, admin);
    expect(ownerRevokeCall.transactionResult.status).toBe(
      TransactionStatus.success
    );

    await expect(() => revokeAdmin(managerAdmin, newAdmin)).rejects.toThrow(
      /NotOwner/
    );

    // When admin is revoked, it can't register a record
    await expect(() => registerRecord(managerAdmin)).rejects.toThrow(
      /OnlyOwner/
    );

    // Admin can register a record when added by owner
    const newAdminRegisterResult = await registerRecord(managerNewAdmin);
    expect(newAdminRegisterResult.transactionResult.status).toBe(
      TransactionStatus.success
    );
  });

  it('should change the primary handle correctly', async () => {
    const [owner] = node.wallets;
    const firstDomain = randomName();
    const secondDomain = randomName();
    const resolverAddress1 = { Address: { bits: getRandomB256() } };
    const resolverAddress2 = { Address: { bits: getRandomB256() } };

    // create first record
    const firstRecordInput = {
      owner: { Address: { bits: owner.address.toB256() } },
      resolver: resolverAddress1,
      period: bn(1),
      timestamp: bn(1),
    };

    const { waitForResult: waitForFirstRecord } = await manager.functions
      .set_record(firstDomain, firstRecordInput)
      .call();
    await waitForFirstRecord();

    // create second record
    const secondRecordInput = {
      owner: { Address: { bits: owner.address.toB256() } },
      resolver: resolverAddress2,
      period: bn(1),
      timestamp: bn(1),
    };
    const { waitForResult: waitForSecondRecord } = await manager.functions
      .set_record(secondDomain, secondRecordInput)
      .call();
    await waitForSecondRecord();

    // set the second domain as primary handle
    const { waitForResult: awaitChangePrimaryHandle } = await manager.functions
      .set_primary_handle(secondDomain)
      .call();
    await awaitChangePrimaryHandle();

    const { value: resolverAddress } = await manager.functions
      .get_resolver(secondDomain)
      .get();
    expect(resolverAddress?.Address?.bits).toBe(owner.address.toB256());

    const { value: newPrimaryHandle } = await manager.functions
      .get_name({ Address: { bits: owner.address.toB256() } })
      .get();

    expect(newPrimaryHandle).toBe(secondDomain);
    expect(newPrimaryHandle).not.toBe(firstDomain);
  });

  it('should error when trying to change the primary handle if it is not the owner', async () => {
    const { wallets } = node;
    const [owner, notOwner] = wallets;

    const notOwnerManager = new Manager(manager.id, notOwner);

    const { value: actualOwnerPrimaryHandle } = await manager.functions
      .get_name({
        Address: { bits: owner.address.toB256() },
      })
      .get();

    await expect(async () => {
      await notOwnerManager.functions
        .set_primary_handle(actualOwnerPrimaryHandle!)
        .addContracts([manager])
        .call();
    }).rejects.toThrow(/OnlyOwner/);
  });
});
