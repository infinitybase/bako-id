import { TestAssetId } from 'fuels/test-utils';

import { type Account, type WalletUnlocked, bn } from 'fuels';
import type { Marketplace } from '../../contracts/src';
import {
  adjustFee,
  callAndWait,
  registerAsset,
  setup,
} from '../../contracts/tests/utils';

describe('Marketplace (Owner)', () => {
  let node: Awaited<ReturnType<typeof setup>>['node'];
  let marketplace: Marketplace;
  let nonOwner: WalletUnlocked;
  let owner: Account;

  beforeAll(async () => {
    const {
      node: setupNode,
      marketplace: setupMarketplace,
      owner: setupOwner,
    } = await setup();
    marketplace = setupMarketplace;
    node = setupNode;
    nonOwner = node.wallets[1];
    marketplace.account = nonOwner;
    owner = setupOwner;
  });

  afterAll(async () => {
    await node.cleanup();
  });

  it('should not allow a non-owner to add a valid asset', async () => {
    const asset = TestAssetId.A.value;

    await expect(registerAsset(marketplace, asset, bn(0))).rejects.toThrow(
      /NotOwner/,
    );
  });

  it('should not allow a non-owner to adjust the fee of an asset', async () => {
    const asset = TestAssetId.A.value;

    await expect(adjustFee(marketplace, asset, bn(0))).rejects.toThrow(
      /NotOwner/,
    );
  });

  it('should transfer the ownership of the contract', async () => {
    marketplace.account = owner;

    await callAndWait(
      marketplace.functions.transfer_ownership({
        Address: { bits: nonOwner.address.toB256() },
      }),
    );

    const asset = TestAssetId.A.value;
    await expect(registerAsset(marketplace, asset, bn(0))).rejects.toThrow(
      /NotOwner/,
    );
  });

  it('should not allow a non-owner to pause the contract', async () => {
    await expect(callAndWait(marketplace.functions.pause())).rejects.toThrow(
      /NotOwner/,
    );
  });

  it('should not allow a non-owner to unpause the contract', async () => {
    await expect(callAndWait(marketplace.functions.unpause())).rejects.toThrow(
      /NotOwner/,
    );
  });
});
