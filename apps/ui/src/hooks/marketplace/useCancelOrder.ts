import type { Order as ListOrder, Order } from '@/types/marketplace';
import { BakoIDQueryKeys, MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import { useAccount } from '@fuels/react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useChainId } from '../useChainId';
import { useMutationWithPolling } from '../useMutationWithPolling';
import { useMarketplace } from './useMarketplace';
import { useProcessingOrders } from '@/contexts/ProcessingOrdersContext';

export const useCancelOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { chainId } = useChainId();
  const { search } = useSearch({ strict: false });
  const { addCancelledOrdersId, removeCancelledOrdersId } =
    useProcessingOrders();
  const address = account?.toLowerCase();

  const {
    mutate: cancelOrder,
    mutateAsync: cancelOrderAsync,
    ...rest
  } = useMutationWithPolling({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      await marketplace.cancelOrder(orderId);
      return orderId;
    },
    mutationOpts: {
      onSuccess: async (cancelledOrderid) => {
        addCancelledOrdersId(cancelledOrderid);
        await queryClient.invalidateQueries({
          queryKey: [BakoIDQueryKeys.NFTS, chainId, address],
        });
      },
    },
    pollConfigs: [
      {
        getQueryKey: () => [MarketplaceQueryKeys.USER_ORDERS, address],
        isDataReady: (
          data: InfiniteData<PaginationResult<Order>> | undefined,
          payload
        ) => {
          if (!data) return true;

          return !data.pages[0].data.find((order) => order.id === payload);
        },
      },
      {
        getQueryKey: () => [
          MarketplaceQueryKeys.ALL_ORDERS,
          chainId,
          search || '', // -> search
        ],
        isDataReady: (
          data: InfiniteData<PaginationResult<ListOrder>> | undefined,
          payload
        ) => {
          if (!data) return true;

          const orders = data.pages.flatMap((page) => page.data);
          const isReady = !orders.find((order) => order.id === payload);

          if (isReady) {
            removeCancelledOrdersId(payload);
          }

          return isReady;
        },
      },
    ],
  });

  return { cancelOrder, cancelOrderAsync, ...rest };
};
