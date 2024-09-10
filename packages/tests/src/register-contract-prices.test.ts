import {
  Provider,
  TransactionStatus,
  type WalletUnlocked,
  ZeroBytes32,
  bn,
} from 'fuels';
import {
  TestRegistryContract,
  TestStorageContract,
  createWallet,
  domainPrices,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
} from './utils';

describe('[PRICES] Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let storage: TestStorageContract;
  let registry: TestRegistryContract;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider);
    storage = await TestStorageContract.deploy(wallet);
    registry = await TestRegistryContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
    await storage.initialize(wallet, registry.id.toB256());
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
