import { TransactionStatus, ZeroBytes32 } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { Nft, NftFactory } from '../src';
import { expectContainLogError, expectRequireRevertError } from './utils';

describe('[METHODS] NFT Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;
  let nft: Nft;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [{ factory: NftFactory }],
    });

    const {
      contracts: [nftAbi],
      wallets: [deployer],
    } = node;

    nft = new Nft(nftAbi.id, deployer);

    const nftCall = await nft.functions
      .constructor({ Address: { bits: deployer.address.toB256() } })
      .call();
    await nftCall.waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error on construct when already initialized', async () => {
    const { wallets } = node;
    const [owner] = wallets;

    try {
      const { waitForResult } = await nft.functions
        .constructor({ Address: { bits: owner.address.toB256() } })
        .call();

      const { transactionResult } = await waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'CannotReinitialized');
    }
  });

  it('should an error when minting from an account that is not the owner', async () => {
    const { wallets } = node;
    const [owner, account] = wallets;

    try {
      nft.account = account;
      const { waitForResult } = await nft.functions
        .mint({ Address: { bits: account.address.toB256() } }, ZeroBytes32, 1)
        .call();

      const { transactionResult } = await waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'NotOwner');
    } finally {
      nft.account = owner;
    }
  });

  it('should mint a nft successfully', async () => {
    const { wallets } = node;
    const [account] = wallets;

    const { waitForResult } = await nft.functions
      .mint({ Address: { bits: account.address.toB256() } }, ZeroBytes32, 1)
      .call();

    const { transactionResult } = await waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);

    const mintedAsset = transactionResult.mintedAssets[0];
    expect(mintedAsset).toBeDefined();
    expect(mintedAsset.subId).toBe(ZeroBytes32);
    expect(mintedAsset.contractId).toBe(nft.id.toB256());
    expect(mintedAsset.amount.toString()).toBe('1');
  });
});
