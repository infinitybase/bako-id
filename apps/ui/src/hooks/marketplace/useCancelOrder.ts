import { useProfile } from '@/modules/profile/hooks/useProfile';
import { marketplaceClient } from '@/services/marketplace';
import { OrderStatus, type Order as ListOrder } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getOrderMetadata } from '@/utils/getOrderMetadata';
import type { PaginationResult } from '@/utils/pagination';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';

export const useCancelOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { domain } = useProfile();
  const { chainId } = useChainId();

  const address = domain?.Address?.bits || domain?.ContractId?.bits;

  const {
    mutate: cancelOrder,
    mutateAsync: cancelOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      return await marketplace.cancelOrder(orderId);
    },
    onSuccess: async (_, orderId) => {
      const previousOrders = queryClient.getQueriesData<
        PaginationResult<ListOrder>
      >({
        queryKey: [MarketplaceQueryKeys.ORDERS],
        exact: false,
      })[0][1] as PaginationResult<ListOrder>;

      const updatedOrders = previousOrders.data.filter(
        (order) => order.id !== orderId
      );
      const hasNextPage = previousOrders.hasNextPage;

      if (hasNextPage) {
        const nextPage = previousOrders.page + 1;
        const nextPageOrders = queryClient.getQueryData<
          PaginationResult<ListOrder>
        >([MarketplaceQueryKeys.ORDERS, address, nextPage]);

        if (nextPageOrders) {
          const firstOrder = nextPageOrders.data[0];
          updatedOrders.push(firstOrder);
        }

        const nextOrder = await marketplaceClient.getOrders({
          where: {
            seller: {
              _eq: address,
            },
            status: {
              _eq: OrderStatus.CREATED,
            },
          },
          offset: (nextPage - 1) * previousOrders.limit,
          count: 1,
          // @ts-expect-error - sort by db_write_timestamp
          sort: { db_write_timestamp: 'desc' },
        });

        if (nextOrder.length > 0) {
          const order = nextOrder[0];
          const orderWithMetadata = await getOrderMetadata(order, chainId);
          updatedOrders.push(orderWithMetadata);
        }
      }

      const paginatedOrders = {
        ...previousOrders,
        data: updatedOrders,
      };

      queryClient.setQueriesData<PaginationResult<ListOrder>>(
        { queryKey: [MarketplaceQueryKeys.ORDERS], exact: false },
        () => paginatedOrders
      );

      queryClient.invalidateQueries({ queryKey: ['nfts'] });
    },
  });

  return { cancelOrder, cancelOrderAsync, ...rest };
};
