import { TestAssetId } from 'fuels/test-utils';

import { type Provider, bn } from 'fuels';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Marketplace } from '../src/artifacts/contracts/Marketplace';
import {
  callAndWait,
  createOrder,
  registerAsset,
  setup,
} from '../src/utils/marketplace';

describe('Marketplace (Pausable)', () => {
  let node: Awaited<ReturnType<typeof setup>>['node'];
  let marketplace: Marketplace;
  let provider: Provider;

  beforeAll(async () => {
    const {
      node: setupNode,
      marketplace: setupMarketplace,
      provider: setupProvider,
    } = await setup();
    provider = setupProvider;
    marketplace = setupMarketplace;
    node = setupNode;
  });

  afterAll(async () => {
    await node.cleanup();
  });

  it('should pause the contract', async () => {
    await callAndWait(marketplace.functions.pause());
    const { value: isPaused } = await marketplace.functions.is_paused().get();
    expect(isPaused).toBe(true);
  });

  it('should error when creating an order while paused', async () => {
    await callAndWait(marketplace.functions.pause());
    await expect(
      createOrder(marketplace, TestAssetId.A.value, {
        asset: await provider.getBaseAssetId(),
        amount: 100,
      }),
    ).rejects.toThrow(/Paused/);
    await callAndWait(marketplace.functions.unpause());
  });

  it('should error when executing an order while paused', async () => {
    await registerAsset(marketplace, TestAssetId.B.value, bn(0));
    const { order_id } = await createOrder(marketplace, TestAssetId.A.value, {
      asset: TestAssetId.B.value,
      amount: 100,
    });

    await callAndWait(marketplace.functions.pause());

    await expect(
      callAndWait(
        marketplace.functions.execute_order(order_id).callParams({
          forward: {
            amount: 100,
            assetId: await provider.getBaseAssetId(),
          },
        }),
      ),
    ).rejects.toThrow(/Paused/);
  });
});
