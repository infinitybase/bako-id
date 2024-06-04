import { Provider, Wallet, type WalletUnlocked } from 'fuels';
import { getAll, getGracePeriod, register } from '../index';
import { randomName } from '../utils';

const { PROVIDER_URL, TEST_WALLET } = process.env;

describe('Test Registry', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL!);
    wallet = Wallet.fromPrivateKey(TEST_WALLET!, provider);
  });

  it('should get all domains by owner address', async () => {
    await register({
      domain: randomName(),
      account: wallet,
      resolver: wallet.address.toB256(),
      period: 1,
    });

    const [handle] = await getAll(wallet.address.toB256());

    expect(handle.name).toBeDefined();
    expect(handle.isPrimary).toBeDefined();
  });

  it('should return the grace period for a domain', async () => {
    const domain = randomName();

    await register({
      domain,
      account: wallet,
      resolver: wallet.address.toB256(),
      period: 1,
    });

    const gracePeriod = await getGracePeriod(domain, {
      provider,
    });

    expect(gracePeriod).toBeDefined();
  });
});
