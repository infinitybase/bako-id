import { TransactionStatus } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  Manager,
  ManagerFactory,
  Registry,
  RegistryFactory,
  Resolver,
  ResolverFactory,
} from '../src';
import { expectRequireRevertError, randomName, txParams } from './utils';

describe('[METHODS] Registry Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let manager: Manager;
  let registry: Registry;
  let resolver: Resolver;

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
      contracts: [managerAbi, registryAbi, resolverAbi],
      wallets: [deployer],
    } = node;

    manager = new Manager(managerAbi.id, deployer);
    registry = new Registry(registryAbi.id, deployer);
    resolver = new Resolver(resolverAbi.id, deployer);

    await registry.functions.constructor({ bits: manager.id.toB256() }).call();
    await resolver.functions
      .constructor(
        { bits: manager.id.toB256() },
        { bits: registry.id.toB256() }
      )
      .call();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error on call method without a proxy contract started', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    const { waitForResult: waitForManager } =
      await ManagerFactory.deploy(owner);
    await waitForManager();

    const { waitForResult: waitForRegistry } =
      await RegistryFactory.deploy(owner);
    const { contract: registry } = await waitForRegistry();

    // expect.assertions(2);

    try {
      const callFn = await registry.functions
        .register(domain, { Address: { bits: owner.address.toB256() } })
        .addContracts([manager])
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
    }
  });

  // it('should register domain with 1 year', async () => {
  //   const domain = randomName();
  //
  //   const { transactionResult: txRegister } = await registry.register({
  //     domain,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   expect(txRegister.status).toBe(TransactionStatus.success);
  // });
  //
  // it('should register domain with 2 years', async () => {
  //   const domain = randomName();
  //
  //   const { transactionResult: txRegister } = await registry.register({
  //     domain,
  //     period: 2,
  //     storageAbi: manager,
  //   });
  //
  //   expect(txRegister.status).toBe(TransactionStatus.success);
  // });
  //
  // it('should register domain with 3 years', async () => {
  //   const domain = randomName();
  //
  //   const { transactionResult: txRegister } = await registry.register({
  //     domain,
  //     period: 3,
  //     storageAbi: manager,
  //   });
  //
  //   expect(txRegister.status).toBe(TransactionStatus.success);
  // });
  //
  // it('should error to initialize proxy contract when proxy already initialized', async () => {
  //   const [owner] = node.wallets;
  //
  //   try {
  //     const { transactionResult } = await registry.initialize({
  //       owner: owner,
  //       managerId: manager.id.toB256(),
  //       attestationId: ZeroBytes32,
  //     });
  //     expect(transactionResult.status).toBe(TransactionStatus.failure);
  //   } catch (error) {
  //     expectRequireRevertError(error);
  //     expectContainLogError(error, 'AlreadyInitialized');
  //   }
  // });
  //
  // it('should dont register domain when not available', async () => {
  //   const domain = randomName();
  //
  //   try {
  //     await registry.register({
  //       domain,
  //       period: 1,
  //       storageAbi: manager,
  //     });
  //
  //     const { transactionResult } = await registry.register({
  //       domain,
  //       period: 1,
  //       storageAbi: manager,
  //     });
  //
  //     expect(transactionResult.status).toBe(TransactionStatus.failure);
  //   } catch (error) {
  //     expectRequireRevertError(error);
  //     expectContainLogError(error, 'DomainNotAvailable');
  //   }
  // });
  //
  // it('should create domain register and get resolver', async () => {
  //   const [owner] = node.wallets;
  //   const domain = randomName();
  //
  //   await registry.register({
  //     domain,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   const { value } = await resolver.functions
  //     .resolver(domain)
  //     .addContracts([manager])
  //     .txParams(txParams)
  //     .get();
  //
  //   expect(value).toBe(owner.address.toB256());
  // });
  //
  // it('should error register and get resolver with other domain', async () => {
  //   const domain = randomName();
  //   await registry.register({
  //     domain,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   const wrongDomain = randomName();
  //   const { value } = await resolver.functions
  //     .resolver(wrongDomain)
  //     .txParams(txParams)
  //     .get();
  //
  //   expect(value).toBe(undefined);
  // });
  //
  // it('should get primary domain', async () => {
  //   const address = Address.fromRandom().toB256();
  //
  //   const [primaryDomain, secondaryDomain] = [randomName(), randomName()];
  //   await registry.register({
  //     domain: primaryDomain,
  //     period: 1,
  //     storageAbi: manager,
  //     address,
  //   });
  //   await registry.register({
  //     domain: secondaryDomain,
  //     period: 1,
  //     storageAbi: manager,
  //     address,
  //   });
  //
  //   const { value } = await resolver.functions
  //     .name(address)
  //     .addContracts([manager])
  //     .txParams(txParams)
  //     .get();
  //
  //   expect(value).toBe(primaryDomain);
  // });
  //
  // it('should get all handles by owner address', async () => {
  //   const [owner] = node.wallets;
  //
  //   const address = Address.fromRandom().toB256();
  //   const handles = [randomName(), randomName(), randomName()];
  //
  //   const storage = await TestStorageContract.deploy(owner);
  //   const registry = await TestRegistryContract.startup({
  //     owner,
  //     storageId: storage.id.toB256(),
  //     attestationId: ZeroBytes32,
  //   });
  //   await storage.initialize(owner, registry.id.toB256());
  //
  //   for (const handle of handles) {
  //     await registry.register({
  //       domain: handle,
  //       period: 1,
  //       storageAbi: storage,
  //       address,
  //     });
  //   }
  //
  //   const { value: vecBytes } = await registry.functions
  //     .get_all(owner.address.toB256())
  //     .addContracts([storage])
  //     .txParams(txParams)
  //     .get();
  //
  //   const expected = handles.flatMap((name, index) => {
  //     const size = name.length;
  //     // The first two bytes are the size of the string
  //     return [
  //       0,
  //       size,
  //       ...name.split('').map((char) => char.charCodeAt(0)),
  //       0,
  //       1,
  //       index === 0 ? 1 : 0,
  //     ];
  //   });
  //
  //   expect(expected).toEqual(expect.arrayContaining(Array.from(vecBytes)));
  // });
  //
  // it('should get timestamp by owner name', async () => {
  //   const address = Address.fromRandom().toB256();
  //
  //   const domain = randomName();
  //   await registry.register({
  //     domain,
  //     address,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   const { value } = await registry.functions
  //     .get_grace_period(domain)
  //     .addContracts([manager])
  //     .txParams(txParams)
  //     .get();
  //
  //   expect(value).toEqual({
  //     grace_period: bn(value.grace_period),
  //     timestamp: bn(value.timestamp),
  //     period: bn(value.period),
  //   });
  // });
  //
  // it.each(['@invalid-!@#%$!', 'my@asd.other', '@MYHanDLE'])(
  //   'should throw a error when try register %s',
  //   async (handle) => {
  //     const register = (name: string) =>
  //       registry.register({
  //         domain: name,
  //         period: 1,
  //         storageAbi: manager,
  //       });
  //
  //     const expectErrors = (error: unknown) => {
  //       expectRequireRevertError(error);
  //       expectContainLogError(error, 'InvalidChars');
  //     };
  //
  //     expect.assertions(2);
  //
  //     try {
  //       await register(handle);
  //     } catch (error) {
  //       expectErrors(error);
  //     }
  //   }
  // );
  //
  // it('should be able to edit resolver of a domain', async () => {
  //   const domain = randomName();
  //
  //   const newAddress = Address.fromRandom().toB256();
  //   await registry.register({
  //     domain,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   const editFn = await registry.functions
  //     .edit_resolver(domain, newAddress)
  //     .addContracts([manager])
  //     .txParams(txParams)
  //     .call();
  //
  //   const { transactionResult: txResolver } = await editFn.waitForResult();
  //
  //   const { value } = await resolver.functions.resolver(domain).get();
  //
  //   expect(value).toBe(newAddress);
  //   expect(txResolver.status).toBe(TransactionStatus.success);
  // });
  //
  // it('should not be able to edit resolver of a domain if domain it is not registered', async () => {
  //   const domain = randomName();
  //   const newAddress = Address.fromRandom().toB256();
  //
  //   try {
  //     const callFn = await registry.functions
  //       .edit_resolver(domain, newAddress)
  //       .addContracts([manager])
  //       .txParams(txParams)
  //       .call();
  //
  //     const { transactionResult } = await callFn.waitForResult();
  //     expect(transactionResult.status).toBe(TransactionStatus.failure);
  //   } catch (error) {
  //     expectRequireRevertError(error);
  //     expectContainLogError(error, 'InvalidDomain');
  //   }
  // });
  //
  // it('should throw error if try to edit resolver with same address', async () => {
  //   const [owner] = node.wallets;
  //   const domain = randomName();
  //   const newAddress = owner.address.toB256();
  //
  //   await registry.register({
  //     domain,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   try {
  //     const callFn = await registry.functions
  //       .edit_resolver(domain, newAddress)
  //       .addContracts([manager])
  //       .txParams(txParams)
  //       .call();
  //
  //     const { transactionResult } = await callFn.waitForResult();
  //     expect(transactionResult.status).toBe(TransactionStatus.failure);
  //   } catch (error) {
  //     expectRequireRevertError(error);
  //     expectContainLogError(error, 'SameResolver');
  //   }
  // });
  //
  // it('should not be able to edit resolver of a domain if not owner', async () => {
  //   const [owner, fakeWallet] = node.wallets;
  //
  //   const domain = randomName();
  //   await registry.register({
  //     domain,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   const newAddress = Address.fromRandom().toB256();
  //
  //   try {
  //     registry.account = fakeWallet;
  //
  //     const callFn = await registry.functions
  //       .edit_resolver(domain, newAddress)
  //       .addContracts([manager])
  //       .txParams(txParams)
  //       .call();
  //
  //     const { transactionResult } = await callFn.waitForResult();
  //     expect(transactionResult.status).toBe(TransactionStatus.failure);
  //   } catch (error) {
  //     expectRequireRevertError(error);
  //     expectContainLogError(error, 'NotOwner');
  //   } finally {
  //     registry.account = owner;
  //   }
  // });
  //
  // it('should be able to set a domain as primary', async () => {
  //   const domain = randomName();
  //   const secondaryDomain = randomName();
  //   const address = Address.fromRandom().toB256();
  //
  //   await registry.register({
  //     domain,
  //     address,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   await registry.register({
  //     domain: secondaryDomain,
  //     address,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   const registryFn = await registry.functions
  //     .set_primary_handle(secondaryDomain)
  //     .addContracts([manager])
  //     .txParams(txParams)
  //     .call();
  //
  //   const value = await registryFn.waitForResult();
  //
  //   expect(value.transactionResult.status).toBe(TransactionStatus.success);
  // });
  //
  // it('should not be able to set a domain as primary if not owner', async () => {
  //   const [owner, fakeWallet] = node.wallets;
  //
  //   const domain = randomName();
  //   const secondaryDomain = randomName();
  //   const address = Address.fromRandom().toB256();
  //
  //   await registry.register({
  //     domain,
  //     address,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   await registry.register({
  //     domain: secondaryDomain,
  //     address,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   try {
  //     registry.account = fakeWallet;
  //
  //     const callFn = await registry.functions
  //       .set_primary_handle(secondaryDomain)
  //       .addContracts([manager])
  //       .txParams(txParams)
  //       .call();
  //
  //     const { transactionResult } = await callFn.waitForResult();
  //     expect(transactionResult.status).toBe(TransactionStatus.failure);
  //   } catch (error) {
  //     expectRequireRevertError(error);
  //     expectContainLogError(error, 'NotOwner');
  //   } finally {
  //     registry.account = owner;
  //   }
  // });
  //
  // it('should not be able to set a domain as primary if domain not registered', async () => {
  //   const domain = randomName();
  //   const secondaryDomain = randomName();
  //   const address = Address.fromRandom().toB256();
  //
  //   await registry.register({
  //     domain,
  //     address,
  //     period: 1,
  //     storageAbi: manager,
  //   });
  //
  //   try {
  //     const callFn = await registry.functions
  //       .set_primary_handle(secondaryDomain)
  //       .addContracts([manager])
  //       .call();
  //
  //     const { transactionResult } = await callFn.waitForResult();
  //     expect(transactionResult.status).toBe(TransactionStatus.failure);
  //   } catch (error) {
  //     expectRequireRevertError(error);
  //     expectContainLogError(error, 'InvalidDomain');
  //   }
  // });
});
