import { TransactionStatus, bn } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { Manager, ManagerFactory, Registry, RegistryFactory } from '../src';
import {
  domainPrices,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
} from './utils';

describe('[PRICES] Registry Contract', () => {
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

    const { waitForResult } = await registry.functions
      .constructor({ bits: manager.id.toB256() })
      .call();
    await waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error register with invalid amount', async () => {
    try {
      const [owner] = node.wallets;
      const name = randomName();

      const { waitForResult: waitForRegister } = await registry.functions
        .register(name, {
          Address: { bits: owner.address.toB256() },
        })
        .call();
      const { transactionResult } = await waitForRegister();

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expectRequireRevertError(e);
      expectContainLogError(e, 'InvalidAmount');
    }
  });

  it.each([3, 4, 10])(
    'should register domain with %d chars',
    async (domainLength) => {
      const [owner] = node.wallets;
      const name = randomName(domainLength);

      const { waitForResult: waitForRegister } = await registry.functions
        .register(name, {
          Address: { bits: owner.address.toB256() },
        })
        .call();
      const { transactionResult } = await waitForRegister();

      expect(transactionResult.status).toBe(TransactionStatus.success);
    }
  );

  it.each([
    [3, 2, '0.01'],
    [4, 2, '0.002'],
    [10, 2, '0.0004'],
    [3, 7, '0.035'],
    [4, 7, '0.007'],
    [10, 7, '0.0014'],
  ])(
    'should return right price for domain with %d chars and %d year',
    async (domainLength, years, price) => {
      const domain = randomName(domainLength);
      const testPrice = domainPrices(domain, years);
      expect(bn.parseUnits(price).toString()).toBe(testPrice.toString());
    }
  );
});
