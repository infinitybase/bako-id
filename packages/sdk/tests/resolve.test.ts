import { Provider, Wallet, WalletUnlocked } from 'fuels';
import { resolver } from '../src';

const { PROVIDER_URL, PRIVATE_KEY } = process.env;

describe('Test resolver', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY, provider);
  })

  it('should get undefined value with not found registered', async () => {
    const result = await resolver({
      domain: 'randomnamefortesting90897',
      provider,
    });

    expect(result).toBeUndefined();
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver({
      domain: 'randomnamefortesting90897',
      account: wallet,
    });

    expect(result).toBeUndefined();
  });

  it('should get undefined value with not found registered', async () => {
    const result = await resolver({
      domain: 'randomnamefortesting90897',
      providerURL: PROVIDER_URL,
    });

    expect(result).toBeUndefined();
  });
})
