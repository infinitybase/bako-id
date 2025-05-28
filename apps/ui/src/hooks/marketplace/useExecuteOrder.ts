import type { Order } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useChainId } from '../useChainId';
import { useMutationWithPolling } from '../useMutationWithPolling';
import { useMarketplace } from './useMarketplace';

export const useExecuteOrder = (sellerAddr: string) => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { chainId } = useChainId();
  const { page: pageUrl, search } = useSearch({ strict: false });

  const page = Number(pageUrl || 1);

  const {
    mutate: executeOrder,
    mutateAsync: executeOrderAsync,
    ...rest
  } = useMutationWithPolling({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      return await marketplace.executeOrder(orderId);
    },
    mutationOpts: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['nfts'] });
      },
    },
    pollConfigs: [
      {
        getQueryKey: () => [
          MarketplaceQueryKeys.ORDERS,
          sellerAddr,
          page,
          chainId,
        ],
        isDataReady: (data: PaginationResult<Order> | undefined, orderId) => {
          if (!data) {
            return true;
          }

          const order = data.data.find((order) => order.id === orderId);

          return !order;
        },
      },
      {
        getQueryKey: () => [
          MarketplaceQueryKeys.ALL_ORDERS,
          chainId,
          search || '', // -> search
        ],
        // @ts-expect-error - TODO: Fix this type
        isDataReady: (
          data: InfiniteData<PaginationResult<Order>> | undefined,
          orderId
        ) => {
          if (!data) return true;

          const orders = data.pages.flatMap((page) => page.data);

          return !orders.find((order) => order.id === orderId);
        },
      },
    ],
  });

  return { executeOrder, executeOrderAsync, ...rest };
};
