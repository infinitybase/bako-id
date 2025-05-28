import { marketplaceClient } from '@/services/marketplace';
import { OrderStatus } from '@/types/marketplace';
import { resolverNetworkByChainId } from '@/utils';
import { getOrderMetadata } from './getOrderMetadata';
import { getPagination } from './pagination';

export const getInitialOrders = async (
  address: string,
  chainId: number,
  page: number
) => {
  const network = resolverNetworkByChainId(chainId);
  const where = {
    seller: {
      _eq: address,
    },
    status: {
      _eq: OrderStatus.CREATED,
    },
    network: {
      _eq: network,
    },
  };

  const limit = 12;
  const total = await marketplaceClient.getOrdersCount({ where });
  const orders = await marketplaceClient.getOrders({
    where,
    count: limit,
    offset: (page - 1) * limit,
  });

  const ordersWithMetadata = await Promise.all(
    orders.map(async (order) => getOrderMetadata(order, chainId))
  );

  return getPagination({
    data: ordersWithMetadata,
    page,
    limit,
    total,
  });
};
