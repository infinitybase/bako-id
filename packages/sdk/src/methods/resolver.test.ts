import { Address, Provider, Wallet, type WalletUnlocked } from 'fuels';
import { register, resolver } from '../index';
import { randomName } from '../utils';
import { reverseResolver } from './resolver';

const { PROVIDER_URL, PRIVATE_KEY } = process.env;

describe('Test resolver', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  const domain = 'bako_id_not_found';

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY, provider);
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver(domain, {
      provider,
    });

    expect(result).toBeNull();
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver(domain, {
      account: wallet,
    });

    expect(result).toBeNull();
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver(domain, {
      providerURL: PROVIDER_URL,
    });

    expect(result).toBeNull();
  });

  it('should get name of resolver address', async () => {
    const name = randomName();
    const resolver = Address.fromRandom().toB256();

    await register({
      domain: name,
      account: wallet,
      resolver,
    });

    await expect(
      reverseResolver(resolver, {
        provider,
      })
    ).resolves.toBe(name);

    await expect(
      reverseResolver(resolver, {
        providerURL: provider.url,
      })
    ).resolves.toBe(name);

    await expect(
      reverseResolver(resolver, {
        account: wallet,
      })
    ).resolves.toBe(name);

    // await expect(reverseResolver(resolver)).resolves.toBe(name);
  }, 10000);

  it('should return null on search by resolver without a domain', async () => {
    const resolver = Address.fromRandom().toB256();

    const result = await reverseResolver(resolver);

    expect(result).toBeNull();
  });
});
