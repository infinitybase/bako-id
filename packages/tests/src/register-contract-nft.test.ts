import { Provider, type WalletUnlocked } from 'fuels';
import { createWallet, setupContractsAndDeploy, tryExecute } from './utils';

describe('[NFT] Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/graphql');
    wallet = createWallet(provider);
    contracts = await setupContractsAndDeploy(wallet);
  });

  it('should get SCR20 methods', async () => {
    const { registry, storage } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());

    const { value: assetId } = await registry.register(
      '@my_handle',
      wallet.address.toB256()
    );

    const { value: assetName } = await registry.functions.name(assetId).get();
    const { value: assetSymbol } = await registry.functions
      .symbol(assetId)
      .get();
    const { value: assetDecimals } = await registry.functions
      .decimals(assetId)
      .get();
    const { value: totalAssets } = await registry.functions
      .total_assets()
      .get();
    const { value: totalSupply } = await registry.functions
      .total_supply(assetId)
      .get();

    expect(assetName).toBe('Bako ID');
    expect(assetSymbol).toBe('BNFT');
    expect(totalAssets.toString()).toBe('1');
    expect(totalSupply.toString()).toBe('1');
    expect(assetDecimals.toString()).toBe('0');
  });

  it('should get asset image', async () => {
    const { registry, storage } = contracts;

    await tryExecute(storage.initializeStorage());
    await tryExecute(registry.initializeRegistry());

    const domain = '@myhandle';
    await registry.register(domain, wallet.address.toB256());

    const { value: assetImage } = await registry.functions
      .image_url(domain)
      .get();

    expect(assetImage).toBe('https://assets.bako.id/myhandle');
  });
});
