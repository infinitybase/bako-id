import type { Order as ListOrder } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import { useAccount } from '@fuels/react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useChainId } from '../useChainId';
import { useMutationWithPolling } from '../useMutationWithPolling';
import { useMarketplace } from './useMarketplace';

export const useCancelOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { chainId } = useChainId();
  const { page: pageUrl, search } = useSearch({ strict: false });

  const address = account?.toLowerCase();
  const page = Number(pageUrl || 1);

  const {
    mutate: cancelOrder,
    mutateAsync: cancelOrderAsync,
    ...rest
  } = useMutationWithPolling({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      return await marketplace.cancelOrder(orderId);
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
          address,
          page,
          chainId,
        ],
        isDataReady: (
          data: PaginationResult<ListOrder> | undefined,
          payload
        ) => {
          if (!data) return true;

          return !data.data.find((order) => order.id === payload);
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
          data: InfiniteData<PaginationResult<ListOrder>> | undefined,
          payload
        ) => {
          if (!data) return true;

          const orders = data.pages.flatMap((page) => page.data);

          return !orders.find((order) => order.id === payload);
        },
      },
    ],
  });

  return { cancelOrder, cancelOrderAsync, ...rest };
};
