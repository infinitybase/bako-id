import { Provider, TransactionStatus, type WalletUnlocked, bn } from 'fuels';
import {
  createWallet,
  domainPrices,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
  setupContractsAndDeploy,
} from './utils';

describe('[PRICES] Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider);
    contracts = await setupContractsAndDeploy(wallet);

    await contracts.registry.initializeRegistry();
    await contracts.storage.initializeStorage();
  });

  it('should error register with invalid amount', async () => {
    try {
      const { registry } = contracts;

      const domain = randomName();
      const { transactionResult } = await registry.register(
        domain,
        wallet.address.toB256(),
        1,
        false
      );

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expectRequireRevertError(e);
      expectContainLogError(e, 'InvalidAmount');
    }
  });

  it.each([3, 4, 10])(
    'should register domain with %d chars',
    async (domainLength) => {
      const { registry } = contracts;

      const domain = randomName(domainLength);

      const { transactionResult } = await registry.register(
        domain,
        wallet.address.toB256(),
        1
      );

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
