import { ZeroBytes32 } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { RegistryContractFactory, StorageContractFactory } from '../src';
import { TestRegistryContract, TestStorageContract } from './utils';

describe('[NFT] Registry Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let storage: TestStorageContract;
  let registry: TestRegistryContract;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: StorageContractFactory },
        { factory: RegistryContractFactory },
      ],
    });

    const {
      contracts: [storageAbi, registryAbi],
      wallets: [deployer],
    } = node;

    storage = new TestStorageContract(storageAbi.id, deployer);
    registry = new TestRegistryContract(registryAbi.id, deployer);

    await storage.initialize(deployer, registry.id.toB256());
    await registry.initialize({
      owner: deployer,
      managerId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
  });

  afterAll(() => {
    node.cleanup();
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
    expect(totalSupply?.toString()).toBe('1');
    expect(assetDecimals?.toString()).toBe('0');
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

    expect(assetImage?.String).toBe('https://assets.bako.id/myhandle');
  });
});
