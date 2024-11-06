import { bn, getMintedAssetId, sha256, toUtf8Bytes } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  Manager,
  ManagerFactory,
  Nft,
  NftFactory,
  Registry,
  RegistryFactory,
} from '../src';
import { domainPrices, randomName } from './utils';

describe('[NFT] Registry Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let manager: Manager;
  let registry: Registry;
  let nft: Nft;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: ManagerFactory },
        { factory: RegistryFactory },
        { factory: NftFactory },
      ],
    });

    const {
      contracts: [managerAbi, registryAbi, nftAbi],
      wallets: [deployer],
    } = node;

    manager = new Manager(managerAbi.id, deployer);
    registry = new Registry(registryAbi.id, deployer);
    nft = new Nft(nftAbi.id, deployer);

    const nftCall = await nft.functions
      .constructor({ ContractId: { bits: registry.id.toB256() } })
      .call();
    await nftCall.waitForResult();

    const { waitForResult } = await registry.functions
      .constructor({ bits: manager.id.toB256() }, { bits: nftAbi.id.toB256() })
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
      .addContracts([manager, nft])
      .call();

    await waitForRegister();

    const assetId = getMintedAssetId(
      nft.id.toB256(),
      sha256(toUtf8Bytes(name))
    );

    const mintedNFT = await deployer.getBalance(assetId);
    expect(mintedNFT).toBeDefined();
    expect(mintedNFT.toNumber()).toBe(1);

    const assetIdInput = { bits: assetId };
    const { value: assetName } = await nft.functions.name(assetIdInput).get();
    const { value: assetSymbol } = await nft.functions
      .symbol(assetIdInput)
      .get();
    const { value: assetDecimals } = await nft.functions
      .decimals(assetIdInput)
      .get();
    const { value: totalAssets } = await nft.functions.total_assets().get();
    const { value: totalSupply } = await nft.functions
      .total_supply(assetIdInput)
      .get();

    expect(assetName).toBe('Bako ID');
    expect(assetSymbol).toBe('BID');
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
      .addContracts([manager, nft])
      .call();
    await waitForRegister();

    const assetId = getMintedAssetId(
      registry.id.toB256(),
      sha256(toUtf8Bytes(name))
    );
    const assetIdInput = { bits: assetId };
    const { value: assetImage } = await nft.functions
      .metadata(assetIdInput, 'image:png')
      .get();

    expect(assetImage?.String).toBe(`https://assets.bako.id/${name}`);
  });
});
