import {
  bn,
  getMintedAssetId,
  getRandomB256,
  sha256,
  toUtf8Bytes,
} from 'fuels';
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
        bn(1),
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager, nft])
      .call();

    await waitForRegister();

    const assetId = getMintedAssetId(
      nft.id.toB256(),
      sha256(toUtf8Bytes(name)),
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
        bn(1),
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager, nft])
      .call();
    await waitForRegister();

    const assetId = getMintedAssetId(
      nft.id.toB256(),
      sha256(toUtf8Bytes(name)),
    );
    const assetIdInput = { bits: assetId };
    const { value: assetImage } = await nft.functions
      .metadata(assetIdInput, 'image:png')
      .get();

    expect(assetImage?.String).toBe(`https://assets.bako.id/${name}`);
  });

  it('should set new info on metadata', async () => {
    const { wallets, provider } = node;
    const [deployer] = wallets;
    const name = randomName();
    const price = domainPrices(name);
    const metadataKey = 'nome:teste';
    const metadataValue = randomName();

    // generate a new name
    const { waitForResult: waitForRegister } = await registry.functions
      .register(
        name,
        {
          Address: { bits: deployer.address.toB256() },
        },
        bn(1),
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager, nft])
      .call();

    await waitForRegister();

    await manager.functions.get_record(name).get();

    // get the minted asset id
    const mintedAssetId = {
      bits: getMintedAssetId(nft.id.toB256(), sha256(toUtf8Bytes(name))),
    };

    // set the metadata info
    const setTx = await registry.functions
      .set_metadata_info(name, metadataKey, {
        String: metadataValue,
      })
      .addContracts([manager, nft])
      .call();

    await setTx.waitForResult();

    const result = await nft.functions
      .metadata(mintedAssetId, metadataKey)
      .get();

    expect(result.value?.String).toBe(metadataValue);
  });

  it('should edit info on metadata', async () => {
    const { wallets, provider } = node;
    const [deployer] = wallets;
    const name = randomName();
    const price = domainPrices(name);
    const metadataKey = 'nome:teste';
    const metadataValue = randomName();
    const metadataValueAux = randomName();

    // generate a new name
    const { waitForResult: waitForRegister } = await registry.functions
      .register(
        name,
        {
          Address: { bits: deployer.address.toB256() },
        },
        bn(1),
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager, nft])
      .call();
    await waitForRegister();

    // get the minted asset id
    const mintedAssetId = {
      bits: getMintedAssetId(nft.id.toB256(), sha256(toUtf8Bytes(name))),
    };

    // set the metadata info
    await registry.functions
      .set_metadata_info(name, metadataKey, {
        String: metadataValue,
      })
      .addContracts([manager, nft])
      .call();

    const firstResult = await nft.functions
      .metadata(mintedAssetId, `${metadataKey}`)
      .call();

    // set the metadata info again
    await registry.functions
      .set_metadata_info(name, metadataKey, {
        String: metadataValueAux,
      })
      .addContracts([manager, nft])
      .call();

    const secondResult = await nft.functions
      .metadata(mintedAssetId, `${metadataKey}`)
      .call();

    const r1st = await firstResult.waitForResult();
    const r2nd = await secondResult.waitForResult();

    expect(r1st.value?.String).toBe(metadataValue);
    expect(r2nd.value?.String).toBe(metadataValueAux);
    expect(r1st.value?.String).not.toBe(r2nd.value?.String);
  });

  it('should return undefined for unset key', async () => {
    const { wallets, provider } = node;
    const [deployer] = wallets;
    const name = randomName();
    const price = domainPrices(name);
    const metadataKey = 'nome:teste';
    const metadataValue = randomName();

    // generate a new name
    const { waitForResult: waitForRegister } = await registry.functions
      .register(
        name,
        {
          Address: { bits: deployer.address.toB256() },
        },
        bn(1),
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager, nft])
      .call();
    await waitForRegister();

    // get the minted asset id
    const mintedAssetId = {
      bits: getMintedAssetId(nft.id.toB256(), sha256(toUtf8Bytes(name))),
    };

    // set the metadata info
    await registry.functions
      .set_metadata_info(name, metadataKey, {
        String: metadataValue,
      })
      .addContracts([manager, nft])
      .call();

    const result = await nft.functions
      .metadata(mintedAssetId, `${metadataKey}inválid`)
      .call();

    const r = await result.waitForResult();

    expect(r.value?.String).toBeUndefined();
  });

  it('should set a metadata key on not existent mintedAsset', async () => {
    const { wallets, provider } = node;
    const [deployer] = wallets;
    const name = randomName();
    const price = domainPrices(name);
    const metadataKey = 'nome:teste';
    const metadataValue = randomName();
    const random = {
      bits: getRandomB256(),
    };

    // generate a new name
    const { waitForResult: waitForRegister } = await registry.functions
      .register(
        name,
        {
          Address: { bits: deployer.address.toB256() },
        },
        bn(1),
      )
      .callParams({
        forward: { assetId: provider.getBaseAssetId(), amount: price },
      })
      .addContracts([manager, nft])
      .call();
    await waitForRegister();

    // set the metadata info
    await registry.functions
      .set_metadata_info(name, metadataKey, {
        String: metadataValue,
      })
      .addContracts([manager, nft])
      .call();

    const result = await nft.functions
      .metadata(random, `${metadataKey}`)
      .call();

    const r = await result.waitForResult();

    expect(r.value?.String).toBeUndefined();
  });
});
