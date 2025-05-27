/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { Marketplace, type Order } from 'generated';

const parseNetworkName = (chainId: number): 'MAINNET' | 'TESTNET' => {
  switch (chainId) {
    case 0:
      return 'TESTNET';
    case 9889:
      return 'MAINNET';
    default:
      throw new Error(`Unknown chainId: ${chainId}`);
  }
};

const generateCustomUniqueId = (prefix: string, bits: string): string => {
  // Generate a unique ID based on the prefix and bits
  return `${prefix}-${bits}`;
};

Marketplace.AssetFeeAdjustedEvent.handler(async ({ event, context }) => {
  const id = generateCustomUniqueId(
    parseNetworkName(event.chainId),
    event.params.asset.bits
  );
  const asset = await context.Asset.get(id);
  if (asset) {
    context.Asset.set({
      ...asset,
      fees: event.params.fee,
    });
  }
});

Marketplace.AssetAddedEvent2.handler(async ({ event, context }) => {
  const network = parseNetworkName(event.chainId);
  context.Asset.set({
    asset: event.params.asset.bits,
    id: generateCustomUniqueId(network, event.params.asset.bits),
    fees: event.params.fee,
    network,
  });
});

Marketplace.OrderCreatedEvent.handler(async ({ event, context }) => {
  const { order_id, order } = event.params;
  const network = parseNetworkName(event.chainId);

  const entity: Order = {
    id: order_id,
    asset: order.asset.bits,
    amount: order.amount,
    seller: order.seller.payload.bits,
    itemPrice: order.item_price,
    itemAsset: order.item_asset.bits,
    status: 'CREATED',
    network,
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
