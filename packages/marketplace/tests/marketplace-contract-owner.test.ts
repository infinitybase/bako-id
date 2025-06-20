import { TestAssetId } from 'fuels/test-utils';

import { bn, type Account, type WalletUnlocked } from 'fuels';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Marketplace } from '../src/artifacts/contracts';
import {
  adjustFee,
  callAndWait,
  registerAsset,
  setup,
} from '../src/utils/marketplace';

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

    await expect(
      registerAsset(marketplace, asset, bn(0), bn(0))
    ).rejects.toThrow(/NotOwner/);
  });

  it('should not allow a non-owner to adjust the fee of an asset', async () => {
    const asset = TestAssetId.A.value;

    await expect(
      adjustFee(marketplace, asset, { FEE_0: bn(0) })
    ).rejects.toThrow(/NotOwner/);
  });

  it('should transfer the ownership of the contract', async () => {
    marketplace.account = owner;

    await callAndWait(
      marketplace.functions.transfer_ownership({
        Address: { bits: nonOwner.address.toB256() },
      })
    );

    const asset = TestAssetId.A.value;
    await expect(
      registerAsset(marketplace, asset, bn(0), bn(0))
    ).rejects.toThrow(/NotOwner/);
  });

  it('should not allow a non-owner to pause the contract', async () => {
    await expect(callAndWait(marketplace.functions.pause())).rejects.toThrow(
      /NotOwner/
    );
  });

  it('should not allow a non-owner to unpause the contract', async () => {
    await expect(callAndWait(marketplace.functions.unpause())).rejects.toThrow(
      /NotOwner/
    );
  });
});
