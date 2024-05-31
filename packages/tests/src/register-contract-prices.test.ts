import { Provider, TransactionStatus, type WalletUnlocked } from 'fuels';
import {
  createWallet,
  domainPrices,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
  setupContracts,
  setupContractsAndDeploy,
} from './utils';

describe('[PRICES] Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let testContracts: Awaited<ReturnType<typeof setupContracts>>;
  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/graphql');
    wallet = createWallet(provider);
    contracts = await setupContractsAndDeploy(wallet);
    testContracts = await setupContracts(wallet);

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
        false,
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
        1,
      );

      expect(transactionResult.status).toBe(TransactionStatus.success);
    },
  );

  it('should return right price for domain with 3 chars and 2 years', async () => {
    const { registryTestCaller } = testContracts;

    const domain = randomName(3);
    const { value } = await registryTestCaller.functions
      .calculate_domain_price(domain, 2)
      .call();

    const testPrice = domainPrices(domain, 2);

    expect(value.toString()).toBe(testPrice.toString());
  });

  it('should return right price for domain with 4 chars and 2 years', async () => {
    const { registryTestCaller } = testContracts;

    const domain = randomName(4);
    const { value } = await registryTestCaller.functions
      .calculate_domain_price(domain, 2)
      .call();

    const testPrice = domainPrices(domain, 2);

    expect(value.toString()).toBe(testPrice.toString());
  });

  it('should return right price for domain with 10 chars and 2 years', async () => {
    const { registryTestCaller } = testContracts;

    const domain = randomName(10);
    const { value } = await registryTestCaller.functions
      .calculate_domain_price(domain, 2)
      .call();

    const testPrice = domainPrices(domain, 2);

    expect(value.toString()).toBe(testPrice.toString());
  });

  it('should return right price for domain with 3 chars and 7 year', async () => {
    const { registryTestCaller } = testContracts;

    const domain = randomName(3);
    const { value } = await registryTestCaller.functions
      .calculate_domain_price(domain, 7)
      .call();

    const testPrice = domainPrices(domain, 7);

    expect(value.toString()).toBe(testPrice.toString());
  });

  it('should return right price for domain with 4 chars and 7 year', async () => {
    const { registryTestCaller } = testContracts;

    const domain = randomName(4);
    const { value } = await registryTestCaller.functions
      .calculate_domain_price(domain, 7)
      .call();

    const testPrice = domainPrices(domain, 7);

    expect(value.toString()).toBe(testPrice.toString());
  });

  it('should return right price for domain with 10 chars and 7 year', async () => {
    const { registryTestCaller } = testContracts;

    const domain = randomName(10);
    const { value } = await registryTestCaller.functions
      .calculate_domain_price(domain, 7)
      .call();

    const testPrice = domainPrices(domain, 7);

    expect(value.toString()).toBe(testPrice.toString());
  });
});
