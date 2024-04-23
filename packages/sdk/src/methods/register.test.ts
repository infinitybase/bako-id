import { Provider, Wallet, type WalletUnlocked } from 'fuels';
import { register, resolver } from '../index';
import { createFakeWallet } from '../test';
import { InvalidDomainError, NotFoundBalanceError, randomName } from '../utils';

const { PROVIDER_URL, TEST_WALLET } = process.env;

describe('Test Registry', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;
  let fakeWallet: WalletUnlocked;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL!);
    wallet = Wallet.fromPrivateKey(TEST_WALLET!, provider);
    fakeWallet = await createFakeWallet(provider, wallet);
  });

  it('should error when register domain with invalid character', async () => {
    const invalidSuffix = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: 'namenotfuel@',
    });

    await expect(invalidSuffix).rejects.toBeInstanceOf(InvalidDomainError);

    const invalidPreffix = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: '#namenotfuel',
    });

    await expect(invalidPreffix).rejects.toBeInstanceOf(InvalidDomainError);

    const invalidChars = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: 'namen otfuel',
    });

    await expect(invalidChars).rejects.toBeInstanceOf(InvalidDomainError);
  });

  it('should register domain with special characters', async () => {
    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: `bako_${randomName(3)}`,
    });

    expect(result.transactionResult).toBeDefined();
  });

  it('should register domain and get resolver', async () => {
    const domain = randomName();

    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain,
    });

    expect(result.transactionResult.status).toBe('success');

    const resolvedDomain = await resolver(domain, {
      provider,
    });

    expect(resolvedDomain?.owner).toBe(wallet.address.toB256());
    expect(resolvedDomain?.resolver).toBe(wallet.address.toB256());
  });

  it('should error when register domain without balance', async () => {
    const registerResult = register({
      account: fakeWallet,
      resolver: wallet.address.toB256(),
      domain: `do${randomName(1)}`,
    });

    await expect(registerResult).rejects.toBeInstanceOf(NotFoundBalanceError);
  });
});
