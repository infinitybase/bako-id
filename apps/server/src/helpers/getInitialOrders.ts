import { marketplaceClient } from '@/services/marketplace';
import { OrderStatus } from '@/types/marketplace';
import { resolverNetworkByChainId } from '@/utils';
import { getOrderMetadata } from './getOrderMetadata';
import { getPagination } from './pagination';

const LIMIT = 12;

export const getInitialOrders = async (
  address: string | undefined,
  chainId: number,
  page: number
) => {
  if (!address) {
    return getPagination({
      data: [],
      page,
      limit: LIMIT,
      total: 0,
    });
  }
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

  const total = await marketplaceClient.getOrdersCount({ where });
  const orders = await marketplaceClient.getOrders({
    where,
    count: LIMIT,
    offset: (page - 1) * LIMIT,
  });

  const ordersWithMetadata = await Promise.all(
    orders.map(async (order) => getOrderMetadata(order, chainId))
  );

  return getPagination({
    data: ordersWithMetadata,
    page,
    limit: LIMIT,
    total,
  });
};
