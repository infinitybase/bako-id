import { Provider, bn, type WalletUnlocked } from 'fuels';
import { TAI64 } from 'tai64';
import { createWallet, setupContracts } from './utils';

describe('[VALIDITY] Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let contracts: Awaited<ReturnType<typeof setupContracts>>;

  const now = TAI64.now().toUnix();
  const year = TAI64.fromUnix(now + 31536000).toUnix();
  const ninetyDays = TAI64.fromUnix(7776000).toUnix();

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/graphql');
    wallet = createWallet(provider);
    contracts = await setupContracts(wallet);
  });

  it('should throw error if domain is not available', async () => {
    const { registryTestCaller } = contracts;

    const domain = 'mydomain';
    await registryTestCaller.functions
      .register(domain, wallet.address.toB256(), 1, bn(now))
      .call();

    try {
      await registryTestCaller.functions
        .register(domain, wallet.address.toB256(), 1, bn(now))
        .call();
    } catch (e) {
      expect(e.message).toContain('DomainUnavailable');
    }
  });

  it('should throw error if domain is not available and is in grace period', async () => {
    const { registryTestCaller } = contracts;

    const domain = 'mydomain';
    await registryTestCaller.functions
      .register(domain, wallet.address.toB256(), 1, bn(now))
      .call();

    try {
      await registryTestCaller.functions
        .register(domain, wallet.address.toB256(), 1, bn(year))
        .call();
    } catch (e) {
      expect(e.message).toContain('DomainUnavailable');
    }
  });

  it('should not be able to register domain in last day of grace period', async () => {
    const { registryTestCaller } = contracts;

    const domain = 'mydomain';
    await registryTestCaller.functions
      .register(domain, wallet.address.toB256(), 1, bn(now))
      .call();

    try {
      await registryTestCaller.functions
        .register(domain, wallet.address.toB256(), 1, bn(year + ninetyDays))
        .call();
    } catch (e) {
      expect(e.message).toContain('DomainUnavailable');
    }
  });

  it('should be able to register domain after grace period', async () => {
    const { registryTestCaller } = contracts;

    const domain = 'mydomain';
    await registryTestCaller.functions
      .register(domain, wallet.address.toB256(), 1, bn(now))
      .call();

    const { transactionResult } = await registryTestCaller.functions
      .register(domain, wallet.address.toB256(), 1, bn(year + ninetyDays + 1))
      .call();

    expect(transactionResult.status).toBe('success');
  });
});
