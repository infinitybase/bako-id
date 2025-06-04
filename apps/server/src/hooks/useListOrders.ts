'use client';

import { MarketplaceQueryKeys } from '@/helpers/constant';
import { getOrderMetadata } from '@/helpers/getOrderMetadata';
import { getPagination, type PaginationResult } from '@/helpers/pagination';
import { getOrders } from '@/helpers/queries';
import type { Order } from '@/types/marketplace';
import { useQuery } from '@tanstack/react-query';

type useListOrdersProps = {
  account?: string;
  page?: number;
  limit?: number;
  chainId: number;
  initialOrders?: PaginationResult<Order>;
};

export const useListOrders = ({
  account,
  page = 1,
  limit = 12,
  chainId,
  initialOrders,
}: useListOrdersProps) => {
  const { data: orders, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDERS, account, page],
    queryFn: async () => {
      const { orders, total } = await getOrders(account!, {
        page: page.toString(),
        limit: limit.toString(),
        chainId: chainId.toString(),
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
    },
    placeholderData: (previousData) => previousData,
    enabled: !!account,
    initialData: initialOrders,
  });

  return { orders, ...rest };
};
