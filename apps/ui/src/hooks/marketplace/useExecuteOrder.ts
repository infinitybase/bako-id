import { useProfile } from '@/modules/profile/hooks/useProfile';
import { marketplaceService } from '@/services/marketplace';
import type { Order } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getOrderMetadata } from '@/utils/getOrderMetadata';
import type { PaginationResult } from '@/utils/pagination';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';

export const useExecuteOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { domain } = useProfile();
  const { chainId } = useChainId();

  const address = domain?.Address?.bits || domain?.ContractId?.bits;

  const {
    mutate: executeOrder,
    mutateAsync: executeOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      return await marketplace.executeOrder(orderId);
    },
    onSuccess: async (_, orderId) => {
      const previousOrders = queryClient.getQueriesData<
        PaginationResult<Order>
      >({
        queryKey: [MarketplaceQueryKeys.ORDERS],
        exact: false,
      })[0][1] as PaginationResult<Order>;

      const updatedOrders = previousOrders.data.filter(
        (order) => order.id !== orderId
      );
      const hasNextPage = previousOrders.hasNextPage;

      if (hasNextPage) {
        const nextPage = previousOrders.page + 1;
        const nextPageOrders = queryClient.getQueryData<
          PaginationResult<Order>
        >([MarketplaceQueryKeys.ORDERS, address, nextPage]);

        if (nextPageOrders) {
          const firstOrder = nextPageOrders.data[0];
          updatedOrders.push(firstOrder);
        }

        const nextOrder = await marketplaceService.getOrders({
          account: address!,
          page: nextPage,
        });

        if (nextOrder.orders.length > 0) {
          const order = nextOrder.orders[0];
          const orderWithMetadata = await getOrderMetadata(order, chainId);
          updatedOrders.push(orderWithMetadata);
        }
      }

      const paginatedOrders = {
        ...previousOrders,
        data: updatedOrders,
      };

      queryClient.setQueriesData<PaginationResult<Order>>(
        { queryKey: [MarketplaceQueryKeys.ORDERS], exact: false },
        () => paginatedOrders
      );
    },
  });

  return { executeOrder, executeOrderAsync, ...rest };
};
