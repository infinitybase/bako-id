import { Provider, Wallet, WalletUnlocked } from 'fuels';
import { register, resolver } from '../src';
import { InvalidDomainError } from '../src/utils';

const { PROVIDER_URL, TEST_WALLET } = process.env;

function randomName() {
  const name = (Math.random() + 2).toString(32).substring(2);
  return `${name}`;
}

describe('Test Registry', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL);
    wallet = Wallet.fromPrivateKey(TEST_WALLET, provider);
  });

  it('should error when register domain with invalid character', async () => {
    const invalidSuffix = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: 'namenotfuel@'
    });

    await expect(invalidSuffix).rejects.toBeInstanceOf(InvalidDomainError);

    const invalidPreffix = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: '#namenotfuel'
    });

    await expect(invalidPreffix).rejects.toBeInstanceOf(InvalidDomainError);

    const invalidChars = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: 'namen otfuel'
    });

    await expect(invalidChars).rejects.toBeInstanceOf(InvalidDomainError);
  });

  it('should register domain with special characters', async () => {
    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: `bako_${randomName()}`
    });

    expect(result.transactionResult).toBeDefined();
  });

  it('should register domain and get resolver', async () => {
    try {
      const domain = randomName();

      const result = await register({
        account: wallet,
        resolver: wallet.address.toB256(),
        domain: domain
      });

      expect(result.transactionResult.status).toBe('success');

      const resolvedDomain = await resolver({
        domain,
        provider
      });

      expect(resolvedDomain.owner).toBe(wallet.address.toB256());
      expect(resolvedDomain.resolver).toBe(wallet.address.toB256());
    } catch (e) {
      console.log(e);
    }
  });
});
