import { useProfile } from '@/modules/profile/hooks/useProfile';
import { marketplaceService } from '@/services/marketplace';
import type { Order as ListOrder } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getOrderMetadata } from '@/utils/getOrderMetadata';
import type { PaginationResult } from '@/utils/pagination';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';

export const useCancelOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { domain } = useProfile();
  const { chainId } = useChainId();
  const { page } = useSearch({ strict: false });

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
      const _page = page ?? 1;
      const previousOrders = queryClient.getQueryData<
        PaginationResult<ListOrder>
      >([
        MarketplaceQueryKeys.ORDERS,
        address,
        _page,
        chainId,
      ]) as PaginationResult<ListOrder>;

      const updatedOrders = previousOrders.data.filter(
        (order) => order.id !== orderId
      );
      const hasNextPage = previousOrders.hasNextPage;

      if (hasNextPage) {
        const nextPage = previousOrders.page + 1;
        const nextPageOrders = queryClient.getQueryData<
          PaginationResult<ListOrder>
        >([MarketplaceQueryKeys.ORDERS, address, nextPage, chainId]);

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

      queryClient.setQueryData<PaginationResult<ListOrder>>(
        [MarketplaceQueryKeys.ORDERS, address, _page, chainId],
        paginatedOrders
      );

      queryClient.invalidateQueries({ queryKey: ['nfts'] });
    },
  });

  return { cancelOrder, cancelOrderAsync, ...rest };
};
