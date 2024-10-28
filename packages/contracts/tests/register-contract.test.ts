import { TransactionStatus } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { Manager, ManagerFactory, Registry, RegistryFactory } from '../src';
import { expectRequireRevertError, randomName, txParams } from './utils';

describe('[METHODS] Registry Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let manager: Manager;
  let registry: Registry;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: ManagerFactory },
        { factory: RegistryFactory },
      ],
    });

    const {
      contracts: [managerAbi, registryAbi],
      wallets: [deployer],
    } = node;

    manager = new Manager(managerAbi.id, deployer);
    registry = new Registry(registryAbi.id, deployer);

    await registry.functions.constructor({ bits: manager.id.toB256() }).call();
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

  it('should error to initialize proxy contract when proxy already initialized', async () => {
    const [_owner] = node.wallets;

    try {
      const { waitForResult } = await registry.functions
        .constructor({ bits: manager.id.toB256() })
        .call();
      const { transactionResult } = await waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
    }
  });

  it('should dont register domain when not available', async () => {
    const [owner] = node.wallets;
    const domain = randomName();

    try {
      await registry.functions
        .register(domain, { Address: { bits: owner.address.toB256() } })
        .call();

      const { waitForResult } = await registry.functions
        .register(domain, { Address: { bits: owner.address.toB256() } })
        .call();
      const { transactionResult } = await waitForResult();

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
    }
  });

  it.each(['@invalid-!@#%$!', 'my@asd.other', '@MYHanDLE'])(
    'should throw a error when try register %s',
    async (handle) => {
      const [owner] = node.wallets;

      const register = (name: string) =>
        registry.functions
          .register(name, { Address: { bits: owner.address.toB256() } })
          .call();

      const expectErrors = (error: unknown) => {
        expectRequireRevertError(error);
      };

      expect.assertions(1);

      try {
        await register(handle);
      } catch (error) {
        expectErrors(error);
      }
    }
  );
});
