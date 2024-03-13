import { Provider, Wallet, WalletUnlocked } from 'fuels';
import { register, resolver } from '../src';

const { PROVIDER_URL, PRIVATE_KEY } = process.env;

describe('Test resolver', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let domain = 'bako_id_not_found';

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY, provider);
  })

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
})
