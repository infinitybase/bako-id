import { TransactionStatus, ZeroBytes32, bn } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { RegistryContractFactory, StorageContractFactory } from '../src';
import {
  TestRegistryContract,
  TestStorageContract,
  domainPrices,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
} from './utils';

describe('[PRICES] Registry Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let storage: TestStorageContract;
  let registry: TestRegistryContract;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: StorageContractFactory },
        { factory: RegistryContractFactory },
      ],
    });

    const {
      contracts: [storageAbi, registryAbi],
      wallets: [deployer],
    } = node;

    storage = new TestStorageContract(storageAbi.id, deployer);
    registry = new TestRegistryContract(registryAbi.id, deployer);

    await storage.initialize(deployer, registry.id.toB256());
    await registry.initialize({
      owner: deployer,
      managerId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error register with invalid amount', async () => {
    try {
      const domain = randomName();
      const { transactionResult } = await registry.register({
        domain,
        period: 1,
        storageAbi: storage,
        calculateAmount: false,
      });

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expectRequireRevertError(e);
      expectContainLogError(e, 'InvalidAmount');
    }
  });

  it.each([3, 4, 10])(
    'should register domain with %d chars',
    async (domainLength) => {
      const domain = randomName(domainLength);

      const { transactionResult } = await registry.register({
        domain,
        period: 1,
        storageAbi: storage,
      });

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
