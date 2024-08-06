import {
  Address,
  Provider,
  Wallet,
  getMintedAssetId,
  sha256,
  type WalletUnlocked,
} from 'fuels';
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
    const domainHash = sha256(domainToBytes(name));

    await register({
      domain: name,
      account: wallet,
      resolver: resolverAddress,
    });

    const token = await tokenInfo(name, { provider });

    expect(token?.name).toBe('Bako ID');
    expect(token?.image).toBe(`https://assets.bako.id/${name}`);
    expect(token?.symbol).toBe('BNFT');
    expect(token?.assetId).toBe(
      getMintedAssetId(config.REGISTRY_CONTRACT_ID, domainHash),
    );
    expect(token?.subId).toBe(domainHash);
    expect(token?.contractId).toBe(config.REGISTRY_CONTRACT_ID);
  });

  it('should undefined values on token not minted', async () => {
    const name = randomName();
    const tokenResult = await tokenInfo(name, { provider });

    expect(tokenResult).toBeUndefined();
  });
});
