import {
  type Provider,
  type Account,
  sha256,
  getTransactionSummary,
  getDecodedLogs,
  bn,
  type JsonAbi,
  toUtf8Bytes,
  getMintedAssetId,
} from 'fuels';
import fs from 'node:fs';

import path from 'node:path';

interface UploaderEventLog {
  file_hash: string;
  handle: string;
  sender: {
    bits: string;
  };
  owner: {
    Address: {
      bits: string;
    };
  };
}

import {
  UploaderValidatorScript,
  Manager,
  ManagerFactory,
  Nft,
  NftFactory,
  Registry,
  RegistryFactory,
} from '../src';
import { launchTestNode } from 'fuels/test-utils';
import { domainPrices, randomName } from './utils';

const createSetup = (
  wallet: Account,
  registryId: string,
  managerId: string
) => {
  const script = new UploaderValidatorScript(wallet);
  script.setConfigurableConstants({
    MANAGER_ADDRESS: managerId,
    REGISTRY_ADDRESS: registryId,
  });

  const imagePath = path.resolve(__dirname, './image.png');
  const image = fs.readFileSync(imagePath);
  const fileHash = sha256(image);

  return { script, fileHash };
};

const decodeTransactionLogs = async (
  transactionId: string,
  provider: Provider,
  otherAbis: Record<string, JsonAbi>
) => {
  const transaction = await getTransactionSummary({
    id: transactionId,
    provider,
  });

  return getDecodedLogs<UploaderEventLog>(
    transaction.receipts,
    UploaderValidatorScript.abi,
    otherAbis
  );
};

describe('Uploader script', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let manager: Manager;
  let registry: Registry;
  let nft: Nft;
  let transactionId: string;
  let fileHash: string;
  let name: string;
  const baseUrl = 'http://bako.id/TESTNET/avatar/';

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
      wallets: [owner],
    } = node;

    manager = new Manager(managerAbi.id, owner);
    registry = new Registry(registryAbi.id, owner);
    nft = new Nft(nftAbi.id, owner);

    const nftCall = await nft.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } }
      )
      .call();
    await nftCall.waitForResult();

    const registryContructor = await registry.functions
      .constructor(
        { bits: owner.address.toB256() },
        { bits: manager.id.toB256() },
        { bits: nft.id.toB256() }
      )
      .call();
    await registryContructor.waitForResult();

    const managerConstructor = await manager.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } }
      )
      .call();
    await managerConstructor.waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should execute successfully', async () => {
    const { provider, wallets } = node;
    const managerId = manager.id.toB256();
    const registryId = registry.id.toB256();
    const [owner, deployer] = wallets;

    name = randomName();
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

    const { script, fileHash: fileHashFromScript } = createSetup(
      owner,
      registryId,
      managerId
    );

    const tx = await script.functions
      .main(fileHashFromScript, name, baseUrl)
      .addContracts([manager, nft])
      .call();

    const { transactionResult } = await tx.waitForResult();

    transactionId = transactionResult.id;
    fileHash = fileHashFromScript;
    expect(transactionResult.status).toBe('success');
  });

  it('should verify correctly', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;

    const [, , , , uploadEvent] = await decodeTransactionLogs(
      transactionId,
      provider,
      {
        [nft.id.toB256()]: Nft.abi,
        [manager.id.toB256()]: Manager.abi,
      }
    );

    expect(uploadEvent.file_hash).toBe(fileHash);
    expect(uploadEvent.handle).toBe(name);
    expect(uploadEvent.owner.Address.bits).toBe(owner.address.toB256());
  });

  it('should error when the address is not the owner', async () => {
    const { wallets } = node;
    const managerId = manager.id.toB256();
    const registryId = registry.id.toB256();
    const [, deployer] = wallets;

    const { script, fileHash } = createSetup(deployer, registryId, managerId);

    await expect(
      script.functions.main(fileHash, name, baseUrl).call()
    ).rejects.toThrow();
  });

  it('should verify if the avatar property exists in the owner metadata', async () => {
    const { provider, wallets } = node;
    const [owner] = wallets;

    const [, , , , uploadEvent] = await decodeTransactionLogs(
      transactionId,
      provider,
      {
        [nft.id.toB256()]: Nft.abi,
        [manager.id.toB256()]: Manager.abi,
      }
    );

    expect(uploadEvent.file_hash).toBe(fileHash);
    expect(uploadEvent.handle).toBe(name);
    expect(uploadEvent.owner.Address.bits).toBe(owner.address.toB256());
  });

  it('should return saved metadata', async () => {
    const assetId = getMintedAssetId(
      nft.id.toB256(),
      sha256(toUtf8Bytes(name))
    );

    const { value: avatarHash } = await nft.functions
      .metadata({ bits: assetId }, 'avatar:hash')
      .get();

    const { value: avatar } = await nft.functions
      .metadata({ bits: assetId }, 'avatar')
      .get();

    expect(avatarHash?.B256).toBe(fileHash);
    expect(avatar?.String).toBe(baseUrl + name);
  });
});
