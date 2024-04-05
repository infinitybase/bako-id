import {
  Provider,
  RequireRevertError,
  TransactionStatus,
  type WalletUnlocked,
} from 'fuels';
import {
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
  setupContractsAndDeploy,
} from './utils';

describe('[PRICES] Test Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/graphql');
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
        false
      );

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expectRequireRevertError(e);
      expectContainLogError(e.cause.logs, 'InvalidAmount');
    }
  });

  it.each([3, 4, 10])(
    'should register domain with %d chars',
    async (domainLength) => {
      const { registry } = contracts;

      const domain = randomName(domainLength);

      const { transactionResult } = await registry.register(
        domain,
        wallet.address.toB256()
      );

      expect(transactionResult.status).toBe(TransactionStatus.success);
    }
  );
});
