import { Address, Provider, type WalletUnlocked } from 'fuels';
import { register, resolver } from '../index';
import { createFakeWallet } from '../test';
import { randomName } from '../utils';
import { owner, resolverName } from './resolver';

const { PROVIDER_URL } = process.env;

describe('Test resolver', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  const domain = 'bako_id_not_found';

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL!);
    wallet = await createFakeWallet(provider, '1.1');
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver(domain, {
      provider,
    });

    expect(result).toBeUndefined();
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver(domain, {
      account: wallet,
    });

    expect(result).toBeUndefined();
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver(domain, {
      providerURL: PROVIDER_URL,
    });

    expect(result).toBeUndefined();
  });

  it('should get resolver, owner and name', async () => {
    const name = randomName();
    const resolverAddress = Address.fromRandom().toB256();

    await register({
      domain: name,
      account: wallet,
      resolver: resolverAddress,
    });

    const resolverAddressResult = await resolver(name, {
      providerURL: PROVIDER_URL,
    });
    expect(resolverAddressResult).toBe(resolverAddress);

    const ownerAddressResult = await owner(name, {
      providerURL: PROVIDER_URL,
    });
    expect(ownerAddressResult).toBe(wallet.address.toB256());

    const resolverNameResult = await resolverName(resolverAddress, {
      providerURL: PROVIDER_URL,
    });
    expect(resolverNameResult).toBe(name);
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
      resolverName(resolver, {
        provider,
      })
    ).resolves.toBe(name);

    await expect(
      resolverName(resolver, {
        providerURL: provider.url,
      })
    ).resolves.toBe(name);

    await expect(
      resolverName(resolver, {
        account: wallet,
      })
    ).resolves.toBe(name);

    // await expect(resolverName(resolver)).resolves.toBe(name);
  }, 10000);

  it('should return null on search by resolver without a domain', async () => {
    const resolver = Address.fromRandom().toB256();

    const result = await resolverName(resolver);

    expect(result).toBeNull();
  });
});
