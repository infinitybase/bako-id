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
  })

  it('should error when register domain without .fuel', async () => {
    try {
      const result = await register({
        account: wallet,
        resolver: wallet.address.toB256(),
        domain: 'namenotfuel.modl',
      });

      expect(result).toBeUndefined();
    } catch (e) {
      console.log(e);
      expect(e).toBeInstanceOf(InvalidDomainError);
    }
  });

  it('should register domain and get resolver', async () => {
    const domain = randomName();

    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain,
    });

    expect(result.transactionResult.status).toBe( 'success');

    const resolvedDomain = await resolver({
      domain,
      provider,
    })

    expect(resolvedDomain.owner).toBe(wallet.address.toB256());
    expect(resolvedDomain.resolver).toBe(wallet.address.toB256());
  });
})
