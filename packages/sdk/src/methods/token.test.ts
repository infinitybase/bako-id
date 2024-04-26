import { Address, Provider, Wallet, type WalletUnlocked, sha256 } from 'fuels';
import { config, register } from '../index';
import { domainToBytes, randomName } from '../utils';
import { tokenInfo } from './token';

const { PROVIDER_URL, PRIVATE_KEY } = process.env;

describe('Test token', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL!);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY!, provider);
  });

  it('should get token infos', async () => {
    const name = randomName();
    const resolverAddress = Address.fromRandom().toB256();

    await register({
      domain: name,
      account: wallet,
      resolver: resolverAddress,
    });

    const {
      image,
      subId,
      symbol,
      contractId,
      name: tokenName,
    } = await tokenInfo(name);

    expect(tokenName).toBe('Bako ID');
    expect(image).toBe(`https://assets.bako.id/${name}`);
    expect(symbol).toBe('BNFT');
    expect(subId).toBe(sha256(domainToBytes(name)));
    expect(contractId).toBe(config.REGISTRY_CONTRACT_ID);
  });

  it('should undefined values on token not minted', async () => {
    const name = randomName();
    const tokenResult = await tokenInfo(name, { provider });
    expect(tokenResult).toBeUndefined();
  });
});
