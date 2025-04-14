import {
  type FunctionInvocationScope,
  TransactionStatus,
  type WalletUnlocked,
  bn,
} from 'fuels';
import { TestAssetId, launchTestNode } from 'fuels/test-utils';
import type { Marketplace } from '../src/artifacts';
import { MarketplaceFactory } from '../src/artifacts';
import { MarketplaceContract } from '../src/sdk';

const callAndWait = async <T extends unknown[], R>(
  method: FunctionInvocationScope<T, R>,
) => {
  const result = await method.call();
  return result.waitForResult();
};

const setup = async () => {
  const [feeAssetId] = TestAssetId.random(1);
  const node = await launchTestNode({
    contractsConfigs: [{ factory: MarketplaceFactory }],
    walletsConfig: {
      assets: [TestAssetId.A, TestAssetId.B, feeAssetId],
    },
  });

  const [contract] = node.contracts;
  const [owner] = node.wallets;

  const marketplace = contract as Marketplace;
  const provider = node.provider;

  await callAndWait(
    marketplace.functions.initialize({
      Address: { bits: owner.address.toB256() },
    }),
  );

  await callAndWait(
    marketplace.functions.add_valid_asset({ bits: TestAssetId.B.value }, bn(1)),
  );

  return { node, marketplace, provider, feeAssetId: feeAssetId.value, owner };
};

describe('Marketplace SDK (Contract)', () => {
  let marketplace: Marketplace;
  let owner: WalletUnlocked;
  let contract: MarketplaceContract;

  beforeAll(async () => {
    const setupResult = await setup();
    marketplace = setupResult.marketplace;
    owner = setupResult.owner;
    contract = new MarketplaceContract(marketplace.id.toB256(), owner);
  });

  let orderId: string;
  it('should create an order', async () => {
    const { orderId: id, transactionResult } = await contract.createOrder({
      itemAsset: TestAssetId.A.value,
      itemAmount: bn(1),
      sellPrice: bn(100),
      sellAsset: TestAssetId.B.value,
    });

    orderId = id;
    expect(orderId).toBeDefined();
    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should get order by id', async () => {
    const order = await contract.getOrder(orderId);
    expect(order).toBeDefined();
    expect(order?.itemAsset).toBe(TestAssetId.A.value);
    expect(order?.itemAmount.toString()).toBe(bn(1).toString());
    expect(order?.sellPrice.toString()).toBe(bn(100).toString());
    expect(order?.sellAsset).toBe(TestAssetId.B.value);
  });

  it('should update order', async () => {
    const { transactionResult } = await contract.updateOrder(orderId, {
      sellPrice: bn(200),
      sellAsset: TestAssetId.B.value,
    });

    expect(transactionResult.status).toBe(TransactionStatus.success);

    const order = await contract.getOrder(orderId);
    expect(order?.sellPrice.toString()).toBe(bn(200).toString());
    expect(order?.sellAsset).toBe(TestAssetId.B.value);
  });

  it('should cancel order', async () => {
    const { transactionResult } = await contract.cancelOrder(orderId);
    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should not execute order when cancelled', async () => {
    await expect(contract.executeOrder(orderId)).rejects.toThrow(
      /Order not found/,
    );
  });

  it('should execute order', async () => {
    const { orderId } = await contract.createOrder({
      itemAsset: TestAssetId.A.value,
      itemAmount: bn(1),
      sellPrice: bn(100),
      sellAsset: TestAssetId.B.value,
    });

    const { transactionResult } = await contract.executeOrder(orderId);
    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should not execute order when insufficient balance', async () => {
    const balance = await owner.getBalance(TestAssetId.B.value);
    const { orderId: id } = await contract.createOrder({
      itemAsset: TestAssetId.A.value,
      itemAmount: bn(1),
      sellPrice: balance.add(bn(100)),
      sellAsset: TestAssetId.B.value,
    });

    orderId = id;

    await expect(contract.executeOrder(id)).rejects.toThrow(
      /Insufficient balance/,
    );
  });

  it('should not update order with invalid asset', async () => {
    expect(orderId).toBeDefined();

    await expect(
      contract.updateOrder(orderId, {
        sellPrice: bn(100),
        sellAsset: TestAssetId.A.value,
      }),
    ).rejects.toThrow(/AssetNotValid/);
  });
});
