import { TestAssetId } from 'fuels/test-utils';

import { bn } from 'fuels';
import type { Marketplace } from '../src/artifacts/contracts/Marketplace';
import {
  adjustFee,
  callAndWait,
  createOrder,
  registerAsset,
  setup,
} from './utils';

describe('Marketplace (Fee)', () => {
  let node: Awaited<ReturnType<typeof setup>>['node'];
  let marketplace: Marketplace;
  let feeAssetId: string;

  beforeAll(async () => {
    const {
      node: setupNode,
      marketplace: setupMarketplace,
      feeAssetId: setupFeeAssetId,
    } = await setup();
    feeAssetId = setupFeeAssetId;
    marketplace = setupMarketplace;
    node = setupNode;
  });

  const TEN_PERCENT = bn(10).mul(100);
  const FIVE_PERCENT = bn(5).mul(100);

  afterAll(async () => {
    await node.cleanup();
  });

  it('should add a valid asset with a fee', async () => {
    const asset1 = feeAssetId;
    const assetAddedEvent = await registerAsset(
      marketplace,
      asset1,
      TEN_PERCENT,
    );
    expect(assetAddedEvent).toBeDefined();
    expect(assetAddedEvent.asset.bits).toEqual(asset1);
    expect(assetAddedEvent.fee.toString()).toEqual(TEN_PERCENT.toString());

    const asset2 = TestAssetId.B.value;
    const assetAddedEvent2 = await registerAsset(
      marketplace,
      asset2,
      FIVE_PERCENT,
    );
    expect(assetAddedEvent2).toBeDefined();
    expect(assetAddedEvent2.asset.bits).toEqual(asset2);
    expect(assetAddedEvent2.fee.toString()).toEqual(FIVE_PERCENT.toString());
  });

  it('should adjust the fee of an asset', async () => {
    const asset2 = TestAssetId.B.value;
    const assetFeeAdjustedEvent2 = await adjustFee(
      marketplace,
      asset2,
      TEN_PERCENT,
    );
    expect(assetFeeAdjustedEvent2).toBeDefined();
    expect(assetFeeAdjustedEvent2.asset.bits).toEqual(asset2);
    expect(assetFeeAdjustedEvent2.fee.toString()).toEqual(
      TEN_PERCENT.toString(),
    );
  });

  it('should split the fee between the seller and the marketplace', async () => {
    const [seller, buyer] = node.wallets;

    const asset = TestAssetId.A.value;
    const orderAmount = 100;
    const { order_id } = await createOrder(marketplace, asset, {
      asset: feeAssetId,
      amount: orderAmount,
    });

    const sellerBalance = await seller.getBalance(feeAssetId);

    marketplace.account = buyer;

    const {
      logs: [orderExecutedEvent],
    } = await callAndWait(
      marketplace.functions.execute_order(order_id).callParams({
        forward: {
          amount: orderAmount,
          assetId: feeAssetId,
        },
      }),
    );

    const sellerNewBalance = await seller.getBalance(feeAssetId);
    const expectedFee = bn(orderAmount).mul(TEN_PERCENT).div(10000);
    const expectedSellerAmount = bn(orderAmount).sub(expectedFee);

    expect(orderExecutedEvent).toBeDefined();
    expect(orderExecutedEvent.order_id).toEqual(order_id);
    expect(orderExecutedEvent.fee.toString()).toEqual(expectedFee.toString());
    expect(orderExecutedEvent.amount.toString()).toEqual(
      expectedSellerAmount.toString(),
    );
    expect(sellerNewBalance.toString()).toEqual(
      bn(sellerBalance).add(expectedSellerAmount).toString(),
    );

    marketplace.account = buyer;
  });
});
