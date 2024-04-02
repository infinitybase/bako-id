import { Address, Provider, Wallet, WalletUnlocked } from 'fuels';
import { register, resolver } from '../index';
import { randomName } from '../utils';
import { reverseResolver } from './resolver';

const { PROVIDER_URL, PRIVATE_KEY } = process.env;

describe('Test resolver', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let domain = 'bako_id_not_found';

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY, provider);
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver({
      domain,
      provider,
    });

    expect(result).toBeNull();
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver({
      domain,
      account: wallet,
    });

    expect(result).toBeNull();
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver({
      domain,
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

    const result = await reverseResolver({
      resolver,
      provider,
    });

    expect(result).toBe(name);
  });

  it('should return null on search by resolver without a domain', async () => {
    const resolver = Address.fromRandom().toB256();

    const result = await reverseResolver({
      resolver,
      provider,
    });

    expect(result).toBeNull();
  });
});
