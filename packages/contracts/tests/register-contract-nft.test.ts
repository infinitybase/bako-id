import { bn, getMintedAssetId, sha256, toUtf8Bytes } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { Manager, ManagerFactory, Registry, RegistryFactory } from '../src';
import { domainPrices, randomName } from './utils';

describe('[NFT] Registry Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let manager: Manager;
  let registry: Registry;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: ManagerFactory },
        { factory: RegistryFactory },
      ],
    });

    const {
      contracts: [managerAbi, registryAbi],
      wallets: [deployer],
    } = node;

    manager = new Manager(managerAbi.id, deployer);
    registry = new Registry(registryAbi.id, deployer);

    const { waitForResult } = await registry.functions
      .constructor({ bits: manager.id.toB256() })
      .call();
    await waitForResult();

    const { waitForResult: waitForManager } = await manager.functions
      .constructor({ ContractId: { bits: registry.id.toB256() } })
      .call();
    await waitForManager();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should get SCR20 methods', async () => {
    const { wallets, provider } = node;
    const [deployer] = wallets;

    const name = randomName();
    const price = domainPrices(name);

    const { waitForResult: waitForRegister } = await registry.functions
      .register(
        name,
        {
          Address: { bits: deployer.address.toB256() },
        },
        bn(1)
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager])
      .call();

    await waitForRegister();

    const assetId = getMintedAssetId(
      registry.id.toB256(),
      sha256(toUtf8Bytes(name))
    );

    const mintedNFT = await deployer.getBalance(assetId);
    expect(mintedNFT).toBeDefined();
    expect(mintedNFT.toNumber()).toBe(1);

    const assetIdInput = { bits: assetId };
    const { value: assetName } = await registry.functions
      .name(assetIdInput)
      .get();
    const { value: assetSymbol } = await registry.functions
      .symbol(assetIdInput)
      .get();
    const { value: assetDecimals } = await registry.functions
      .decimals(assetIdInput)
      .get();
    const { value: totalAssets } = await registry.functions
      .total_assets()
      .get();
    const { value: totalSupply } = await registry.functions
      .total_supply(assetIdInput)
      .get();

    expect(assetName).toBe('Bako ID');
    expect(assetSymbol).toBe('BKID');
    expect(totalAssets.toString()).toBe('1');
    expect(totalSupply?.toString()).toBe('1');
    expect(assetDecimals?.toString()).toBe('0');
  });

  it('should get asset image', async () => {
    const { wallets, provider } = node;
    const [deployer] = wallets;
    const name = randomName();
    const price = domainPrices(name);

    const { waitForResult: waitForRegister } = await registry.functions
      .register(
        name,
        {
          Address: { bits: deployer.address.toB256() },
        },
        bn(1)
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager])
      .call();
    await waitForRegister();

    const assetId = getMintedAssetId(
      registry.id.toB256(),
      sha256(toUtf8Bytes(name))
    );
    const assetIdInput = { bits: assetId };
    const { value: assetImage } = await registry.functions
      .metadata(assetIdInput, 'image:png')
      .get();

    expect(assetImage?.String).toBe(`https://assets.bako.id/${name}`);
  });
});
