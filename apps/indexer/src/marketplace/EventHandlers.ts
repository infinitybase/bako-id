/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { Marketplace, type Order } from 'generated';

Marketplace.AssetFeeAdjustedEvent.handler(async ({ event, context }) => {
  const asset = await context.Asset.get(event.params.asset.bits);
  if (asset) {
    context.Asset.set({
      ...asset,
      fee: event.params.fee,
    });
  }
});

Marketplace.AssetAddedEvent.handler(async ({ event, context }) => {
  context.Asset.set({
    id: event.params.asset.bits,
    fee: event.params.fee,
  });
});

Marketplace.OrderCreatedEvent.handler(async ({ event, context }) => {
  const { order_id, order } = event.params;
  const entity: Order = {
    id: order_id,
    asset: order.asset.bits,
    amount: order.amount,
    seller: order.seller.payload.bits,
    itemPrice: order.item_price,
    itemAsset: order.item_asset.bits,
    status: 'CREATED',
  };

  context.Order.set(entity);
});

Marketplace.OrderExecutedEvent.handler(async ({ event, context }) => {
  const { order_id, ...rest } = event.params;

  context.log.info(`Order executed ${rest.fee} ${rest.asset} ${rest.amount}`);

  const order = await context.Order.get(order_id);
  if (order) {
    context.Order.set({
      ...order,
      status: 'COMPLETED',
    });
  }
});

Marketplace.OrderCancelledEvent.handler(async ({ event, context }) => {
  const { order_id } = event.params;

  const order = await context.Order.get(order_id);
  if (order) {
    context.Order.set({
      ...order,
      status: 'CANCELLED',
    });
  }
});

Marketplace.OrderEditedEvent.handler(async ({ event, context }) => {
  const { order_id, new_asset, new_price } = event.params;
  const order = await context.Order.get(order_id);
  if (order) {
    context.Order.set({
      ...order,
      asset: new_asset.bits,
      itemPrice: new_price,
    });
  }
});
