import { bn, type Address } from 'fuels';
import { TestAssetId } from 'fuels/test-utils';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Marketplace } from '../src/artifacts/contracts';
import {
  callAndWait,
  createOrder,
  registerAsset,
  setup,
  withdrawFees,
} from '../src/utils/marketplace';

describe('Marketplace (Withdraw Fees)', () => {
  let node: Awaited<ReturnType<typeof setup>>['node'];
  let marketplace: Marketplace;
  let feeAssetId: string;
  let owner: Address;

  beforeAll(async () => {
    const {
      node: setupNode,
      marketplace: setupMarketplace,
      feeAssetId: setupFeeAssetId,
      owner: setupOwner,
    } = await setup();
    feeAssetId = setupFeeAssetId;
    marketplace = setupMarketplace;
    node = setupNode;
    owner = setupOwner.address;
  });

  const TEN_PERCENT = bn(10).mul(100); // 10%
  const FIVE_PERCENT = bn(5).mul(100); // 5%

  afterAll(async () => {
    await node.cleanup();
  });

  describe('Access Control', () => {
    it('should only allow owner to withdraw fees', async () => {
      const [_, nonOwner] = node.wallets;
      marketplace.account = nonOwner;

      await expect(
        withdrawFees(marketplace, owner.toB256(), feeAssetId)
      ).rejects.toThrow(/NotOwner/);
    });

    it('should allow owner to withdraw fees', async () => {
      const [owner, buyer] = node.wallets;

      marketplace.account = owner;
      await registerAsset(marketplace, feeAssetId, TEN_PERCENT, FIVE_PERCENT);

      const orderAmount = 1000;
      const { order_id } = await createOrder(marketplace, TestAssetId.A.value, {
        asset: feeAssetId,
        amount: orderAmount,
      });

      marketplace.account = buyer;
      await callAndWait(
        marketplace.functions.execute_order(order_id).callParams({
          forward: {
            amount: orderAmount,
            assetId: feeAssetId,
          },
        })
      );

      const recipientBalanceBefore = await buyer.getBalance(feeAssetId);
      marketplace.account = owner;
      const recipientAddress = buyer.address.toB256(); // Use different address as recipient

      const withdrawEvent = await withdrawFees(
        marketplace,
        recipientAddress,
        feeAssetId
      );
      const recipientBalanceAfter = await buyer.getBalance(feeAssetId);

      expect(withdrawEvent).toBeDefined();
      expect(withdrawEvent.asset_id.bits).toEqual(feeAssetId);
      expect(withdrawEvent.amount.gt(0)).toBe(true);
      expect(recipientBalanceAfter.gt(recipientBalanceBefore)).toBe(true);
    });
  });

  describe('Fee Validation', () => {
    it('should revert when trying to withdraw fees for asset with no collected fees', async () => {
      const nonExistentAsset = TestAssetId.A.value;

      marketplace.account = node.wallets[0];
      await expect(
        withdrawFees(marketplace, owner.toB256(), nonExistentAsset)
      ).rejects.toThrow(/AssetFeeEmpty/);
    });

    it('should revert when trying to withdraw zero fees', async () => {
      const unusedAsset = TestAssetId.B.value;
      marketplace.account = node.wallets[0]; // Set as owner
      await registerAsset(marketplace, unusedAsset, TEN_PERCENT, FIVE_PERCENT);

      await expect(
        withdrawFees(marketplace, owner.toB256(), unusedAsset)
      ).rejects.toThrow(/AssetFeeEmpty/);
    });
  });

  describe('Fee Transfer and Storage Cleanup', () => {
    it('should transfer correct fee amount to recipient', async () => {
      const [owner, buyer] = node.wallets;
      const recipient = owner; // Use owner wallet as recipient (won't participate in order transactions)
      const testAsset = feeAssetId;

      marketplace.account = owner; // Set as owner
      await registerAsset(marketplace, testAsset, TEN_PERCENT, FIVE_PERCENT);

      const orderAmount = 2000;
      const orderAsset = TestAssetId.A.value; // Use pre-funded asset for order
      const { order_id } = await createOrder(marketplace, orderAsset, {
        asset: testAsset,
        amount: orderAmount,
      });

      const recipientBalanceBefore = await recipient.getBalance(testAsset);

      marketplace.account = buyer;
      const {
        logs: [orderExecutedEvent],
      } = await callAndWait(
        marketplace.functions.execute_order(order_id).callParams({
          forward: {
            amount: orderAmount,
            assetId: testAsset,
          },
        })
      );

      const expectedFee = orderExecutedEvent.fee;

      // Withdraw fees as owner
      marketplace.account = owner;
      const withdrawEvent = await withdrawFees(
        marketplace,
        recipient.address.toB256(),
        testAsset
      );

      const recipientBalanceAfter = await recipient.getBalance(testAsset);

      expect(withdrawEvent.amount.toString()).toEqual(expectedFee.toString());
      expect(recipientBalanceAfter.gte(recipientBalanceBefore)).toBe(true);
    });

    it('should prevent double withdrawal of the same fees', async () => {
      const [owner, buyer] = node.wallets;
      const testAsset = feeAssetId;

      marketplace.account = owner;
      await registerAsset(marketplace, testAsset, TEN_PERCENT, FIVE_PERCENT);

      const orderAmount = 3000;
      const orderAsset = TestAssetId.B.value; // Use pre-funded asset for order
      const { order_id } = await createOrder(marketplace, orderAsset, {
        asset: testAsset,
        amount: orderAmount,
      });

      marketplace.account = buyer;
      await callAndWait(
        marketplace.functions.execute_order(order_id).callParams({
          forward: {
            amount: orderAmount,
            assetId: testAsset,
          },
        })
      );

      marketplace.account = owner;
      const firstWithdraw = await withdrawFees(
        marketplace,
        owner.address.toB256(),
        testAsset
      );
      expect(firstWithdraw.amount.gt(0)).toBe(true);

      await expect(
        withdrawFees(marketplace, owner.address.toB256(), testAsset)
      ).rejects.toThrow(/AssetFeeEmpty/);
    });
  });

  describe('Multiple Assets', () => {
    it('should handle withdrawal for multiple different assets', async () => {
      const [seller, buyer] = node.wallets;
      const asset1 = feeAssetId;
      const asset2 = TestAssetId.A.value;

      marketplace.account = seller;
      await registerAsset(marketplace, asset1, TEN_PERCENT, FIVE_PERCENT);
      await registerAsset(marketplace, asset2, FIVE_PERCENT, TEN_PERCENT);

      const orderAmount = 1000;

      const orderAsset1 = TestAssetId.B.value;
      const orderAsset2 = TestAssetId.A.value;
      const { order_id: order1 } = await createOrder(marketplace, orderAsset1, {
        asset: asset1,
        amount: orderAmount,
      });
      const { order_id: order2 } = await createOrder(marketplace, orderAsset2, {
        asset: asset2,
        amount: orderAmount,
      });

      marketplace.account = buyer;
      const {
        logs: [orderExecutedEvent1],
      } = await callAndWait(
        marketplace.functions.execute_order(order1).callParams({
          forward: { amount: orderAmount, assetId: asset1 },
        })
      );
      const {
        logs: [orderExecutedEvent2],
      } = await callAndWait(
        marketplace.functions.execute_order(order2).callParams({
          forward: { amount: orderAmount, assetId: asset2 },
        })
      );
      const fee1 = orderExecutedEvent1.fee;
      const fee2 = orderExecutedEvent2.fee;

      marketplace.account = seller;
      const withdraw1 = await withdrawFees(marketplace, owner.toB256(), asset1);
      const withdraw2 = await withdrawFees(marketplace, owner.toB256(), asset2);

      expect(withdraw1.asset_id.bits).toEqual(asset1);
      expect(withdraw2.asset_id.bits).toEqual(asset2);
      expect(withdraw1.amount.gt(0)).toBe(true);
      expect(withdraw2.amount.gt(0)).toBe(true);

      const expectedFee1 = bn(orderAmount).mul(TEN_PERCENT).div(10000);
      const expectedFee2 = bn(orderAmount).mul(FIVE_PERCENT).div(10000);
      expect(withdraw1.amount.toString()).toEqual(expectedFee1.toString());
      expect(withdraw2.amount.toString()).toEqual(expectedFee2.toString());
      expect(fee1.toString()).toEqual(expectedFee1.toString());
      expect(fee2.toString()).toEqual(expectedFee2.toString());
    });
  });

  describe('Accumulated Fees', () => {
    it('should accumulate fees from multiple transactions before withdrawal', async () => {
      const [seller, buyer] = node.wallets;
      const testAsset = feeAssetId;

      marketplace.account = seller;
      await registerAsset(marketplace, testAsset, TEN_PERCENT, FIVE_PERCENT);

      const orderAmount = 2000000;

      const { order_id: order1 } = await createOrder(
        marketplace,
        TestAssetId.A.value,
        {
          asset: testAsset,
          amount: orderAmount,
        }
      );
      const { order_id: order2 } = await createOrder(
        marketplace,
        TestAssetId.B.value,
        {
          asset: testAsset,
          amount: orderAmount,
        }
      );

      marketplace.account = buyer;
      const {
        logs: [orderEvent1],
      } = await callAndWait(
        marketplace.functions.execute_order(order1).callParams({
          forward: { amount: orderAmount, assetId: testAsset },
        })
      );

      marketplace.account = buyer;
      const {
        logs: [orderEvent2],
      } = await callAndWait(
        marketplace.functions.execute_order(order2).callParams({
          forward: { amount: orderAmount, assetId: testAsset },
        })
      );

      const totalExpectedFees = orderEvent1.fee.add(orderEvent2.fee);

      marketplace.account = seller;
      const withdrawEvent = await withdrawFees(
        marketplace,
        owner.toB256(),
        testAsset
      );

      expect(withdrawEvent.asset_id.bits).toEqual(testAsset);
      expect(withdrawEvent.amount.toString()).toEqual(
        totalExpectedFees.toString()
      );
    });
  });
});
