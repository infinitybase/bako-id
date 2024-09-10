import { Provider, type WalletUnlocked, ZeroBytes32 } from 'fuels';
import {
  TestRegistryContract,
  TestStorageContract,
  createWallet,
} from './utils';

describe('[NFT] Registry Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let storage: TestStorageContract;
  let registry: TestRegistryContract;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider);
    storage = await TestStorageContract.deploy(wallet);
    registry = await TestRegistryContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
    await storage.initialize(wallet, registry.id.toB256());
  });

  it('should get SCR20 methods', async () => {
    const { value: assetId } = await registry.register({
      domain: '@my_handle',
      period: 1,
      storageAbi: storage,
    });

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
    const domain = '@myhandle';

    const { value: assetId } = await registry.register({
      domain,
      period: 1,
      storageAbi: storage,
    });

    const { value: assetImage } = await registry.functions
      .metadata(assetId, 'image:png')
      .get();

    expect(assetImage.String).toBe('https://assets.bako.id/myhandle');
  });
});
