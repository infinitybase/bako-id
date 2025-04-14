import { TestAssetId } from 'fuels/test-utils';

import { type Provider, bn } from 'fuels';
import type {
  Marketplace,
  OrderCreatedEventOutput,
} from '../../contracts/src/artifacts/contracts/Marketplace';
import { callAndWait, createOrder, setup } from '../../contracts/tests/utils';

describe('Marketplace (Orders)', () => {
  let node: Awaited<ReturnType<typeof setup>>['node'];
  let marketplace: Marketplace;
  let provider: Provider;

  beforeAll(async () => {
    const {
      node: setupNode,
      marketplace: setupMarketplace,
      provider: setupProvider,
    } = await setup();
    marketplace = setupMarketplace;
    provider = setupProvider;
    node = setupNode;
  });

  afterAll(async () => {
    await node.cleanup();
  });

  it('should add a valid asset', async () => {
    const asset = await provider.getBaseAssetId();
    const {
      logs: [assetAddedEvent],
    } = await callAndWait(
      marketplace.functions.add_valid_asset({ bits: asset }, bn(0)),
    );
    expect(assetAddedEvent.asset.bits).toEqual(asset);

    await callAndWait(
      marketplace.functions.add_valid_asset(
        { bits: TestAssetId.A.value },
        bn(0),
      ),
    );
  });

  it('should not create an order with invalid price', async () => {
    const asset = await provider.getBaseAssetId();
    const itemAsset = TestAssetId.A.value;

    await expect(
      callAndWait(
        marketplace.functions.create_order({ bits: asset }, 0).callParams({
          forward: {
            amount: 1,
            assetId: itemAsset,
          },
        }),
      ),
    ).rejects.toThrow(/PriceNotPositive/);
  });

  let order: OrderCreatedEventOutput;

  it('should create an order', async () => {
    const asset = await provider.getBaseAssetId();
    const itemAsset = TestAssetId.A.value;

    const beforeBalance = await marketplace.getBalance(itemAsset);

    const orderCreatedEvent = await createOrder(marketplace, itemAsset, {
      asset,
      amount: 100,
    });

    expect(orderCreatedEvent).toBeDefined();
    expect(orderCreatedEvent.order_id).toBeDefined();
    expect(orderCreatedEvent.order.item_asset.bits).toEqual(itemAsset);

    const afterBalance = await marketplace.getBalance(itemAsset);
    expect(afterBalance.toString()).toEqual(
      bn(beforeBalance).add(1).toString(),
    );

    order = orderCreatedEvent;
  });

  it('should get the order', async () => {
    const { value } = await marketplace.functions
      .get_order(order.order_id)
      .get();

    expect(value?.item_asset.bits).toEqual(order.order.item_asset.bits);
    expect(value?.item_price.toString()).toEqual(
      order.order.item_price.toString(),
    );
    expect(value?.seller.Address?.bits!).toEqual(
      order.order.seller?.Address?.bits!,
    );
  });

  it('should not allow editing an order with invalid asset', async () => {
    const invalidAsset = TestAssetId.B.value;
    await expect(
      callAndWait(
        marketplace.functions.edit_order(
          order.order_id,
          { bits: invalidAsset },
          order.order.item_price.toNumber(),
        ),
      ),
    ).rejects.toThrow(/AssetNotValid/);
  });

  it('should edit an order', async () => {
    const newPrice = 200;
    const otherAsset = TestAssetId.B.value;
    const {
      logs: [assetAddedEvent],
    } = await callAndWait(
      marketplace.functions.add_valid_asset({ bits: otherAsset }, bn(0)),
    );

    expect(assetAddedEvent.asset.bits).toEqual(otherAsset);

    const {
      logs: [orderEditedEvent],
    } = await callAndWait(
      marketplace.functions.edit_order(
        order.order_id,
        { bits: otherAsset },
        newPrice,
      ),
    );

    expect(orderEditedEvent).toBeDefined();
    expect(orderEditedEvent.order_id).toEqual(order.order_id);
    expect(orderEditedEvent.new_price.toString()).toEqual(newPrice.toString());
    expect(orderEditedEvent.new_asset.bits).toEqual(otherAsset);
  });

  it('should cancel the order', async () => {
    const wallet = node.wallets[0];

    const beforeMarketBalance = await marketplace.getBalance(
      TestAssetId.A.value,
    );
    const beforeWalletBalance = await wallet.getBalance(TestAssetId.A.value);

    const {
      logs: [orderCancelledEvent],
    } = await callAndWait(marketplace.functions.cancel_order(order.order_id));

    expect(orderCancelledEvent).toBeDefined();
    expect(orderCancelledEvent.order_id).toEqual(order.order_id);

    const marketBalance = await marketplace.getBalance(TestAssetId.A.value);
    const walletBalance = await wallet.getBalance(TestAssetId.A.value);

    expect(marketBalance.toString()).toEqual(
      bn(beforeMarketBalance).sub(1).toString(),
    );
    expect(walletBalance.toString()).toEqual(
      bn(beforeWalletBalance).add(1).toString(),
    );

    const { value } = await marketplace.functions
      .get_order(order.order_id)
      .get();
    expect(value).toBeUndefined();
  });

  it('should not cancel an order that does not exist', async () => {
    await expect(
      callAndWait(marketplace.functions.cancel_order(order.order_id)),
    ).rejects.toThrow(/OrderNotFound/);
  });

  it('should not cancel an order that is not owned', async () => {
    const wallet = node.wallets[1];

    const order = await createOrder(marketplace, TestAssetId.A.value, {
      asset: await provider.getBaseAssetId(),
      amount: 100,
    });

    marketplace.account = wallet;

    await expect(
      callAndWait(marketplace.functions.cancel_order(order.order_id)),
    ).rejects.toThrow(/OrderNotOwned/);

    marketplace.account = node.wallets[0];
  });

  it('should execute an order', async () => {
    const [seller, buyer] = node.wallets;

    const sellAsset = TestAssetId.B.value;
    const buyAsset = TestAssetId.A.value;

    const sellerBalance = await seller.getBalance(buyAsset);
    const buyerBalance = await buyer.getBalance(sellAsset);

    marketplace.account = seller;

    const order = await createOrder(marketplace, sellAsset, {
      asset: buyAsset,
      amount: 100,
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
      }),
    );

    const sellerNewBalance = await seller.getBalance(buyAsset);
    const buyerNewBalance = await buyer.getBalance(sellAsset);

    const expectedSellerBalance = bn(sellerBalance).add(order.order.item_price);
    const expectedBuyerBalance = bn(buyerBalance).add(order.order.amount);

    expect(sellerNewBalance.toString()).toEqual(
      expectedSellerBalance.toString(),
    );
    expect(buyerNewBalance.toString()).toEqual(expectedBuyerBalance.toString());

    expect(orderExecutedEvent).toBeDefined();
    expect(orderExecutedEvent.order_id).toEqual(order.order_id);
    expect(orderExecutedEvent.buyer.Address?.bits).toEqual(
      buyer.address.toB256(),
    );
    expect(orderExecutedEvent.amount.toString()).toEqual(
      order.order.item_price.toString(),
    );
    expect(orderExecutedEvent.asset.bits).toEqual(order.order.asset.bits);
  });
});
