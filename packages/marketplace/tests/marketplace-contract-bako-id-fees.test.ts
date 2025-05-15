import { TestAssetId } from 'fuels/test-utils';

import { bn, type Provider } from 'fuels';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Marketplace, ResolverMock } from '../src/artifacts/contracts';
import {
  callAndWait,
  createOrder,
  registerAsset,
  setup,
} from '../src/utils/marketplace';

describe('Marketplace (Bako ID Fees)', () => {
  let node: Awaited<ReturnType<typeof setup>>['node'];
  let marketplace: Marketplace;
  let provider: Provider;
  let resolver: ResolverMock;
  let feeAssetId: string;

  // FEES
  const REGULAR_FEE = bn(10).mul(100); // 10%
  const BAKO_ID_FEE = bn(5).mul(100); // 5% (discounted)

  beforeAll(async () => {
    const {
      node: setupNode,
      marketplace: setupMarketplace,
      provider: setupProvider,
      resolver: setupResolver,
      feeAssetId: setupFeeAssetId,
    } = await setup();

    marketplace = setupMarketplace;
    provider = setupProvider;
    node = setupNode;
    resolver = setupResolver;
    feeAssetId = setupFeeAssetId;

    const baseAsset = await provider.getBaseAssetId();
    await registerAsset(marketplace, baseAsset, REGULAR_FEE, BAKO_ID_FEE);

    await registerAsset(
      marketplace,
      TestAssetId.A.value,
      REGULAR_FEE,
      BAKO_ID_FEE
    );

    await registerAsset(
      marketplace,
      TestAssetId.B.value,
      REGULAR_FEE,
      BAKO_ID_FEE
    );

    await registerAsset(marketplace, feeAssetId, REGULAR_FEE, BAKO_ID_FEE);
  });

  afterAll(async () => {
    await node.cleanup();
  });

  it('should apply regular fee when buyer has no Bako ID handle', async () => {
    const [seller, buyer] = node.wallets;

    marketplace.account = seller;
    const sellAsset = TestAssetId.A.value;
    const buyAsset = TestAssetId.B.value;
    const orderAmount = 1000;

    const order = await createOrder(marketplace, sellAsset, {
      asset: buyAsset,
      amount: orderAmount,
    });

    marketplace.account = buyer;

    const {
      logs: [orderExecutedEvent],
    } = await callAndWait(
      marketplace.functions.execute_order(order.order_id).callParams({
        forward: {
          amount: order.order.item_price,
          assetId: order.order.asset.bits,
        },
      })
    );

    // Check that the regular fee was applied (10%)
    const expectedFee = bn(orderAmount).mul(REGULAR_FEE).div(10000);
    expect(orderExecutedEvent.fee.toString()).toEqual(expectedFee.toString());
  });

  it('should apply discounted fee when buyer has Bako ID handle', async () => {
    const [seller, buyer] = node.wallets;

    // Register the buyer with Bako ID in our mock resolver
    await callAndWait(
      resolver.functions.register('buyer-handle', {
        Address: { bits: buyer.address.toB256() },
      })
    );

    marketplace.account = seller;
    const sellAsset = TestAssetId.A.value;
    const buyAsset = feeAssetId;
    const orderAmount = 1000;

    const order = await createOrder(marketplace, sellAsset, {
      asset: buyAsset,
      amount: orderAmount,
    });

    marketplace.account = buyer;

    const {
      logs: [orderExecutedEvent],
    } = await callAndWait(
      marketplace.functions.execute_order(order.order_id).callParams({
        forward: {
          amount: order.order.item_price,
          assetId: order.order.asset.bits,
        },
      })
    );

    // Check that the discounted fee was applied (5%)
    const expectedFee = bn(orderAmount).mul(BAKO_ID_FEE).div(10000);
    expect(orderExecutedEvent.fee.toString()).toEqual(expectedFee.toString());
  });

  it('should verify that the resolver actually works', async () => {
    const [_, buyer] = node.wallets;

    // Check that our mock resolver correctly reports the buyer having a Bako ID
    const { value: name } = await resolver.functions
      .name({
        Address: { bits: buyer.address.toB256() },
      })
      .get();

    expect(name).toBe('buyer-handle');
  });
});
