import type { Order } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import type { Order as OrderFromFuel } from '@bako-id/marketplace';
import { useAccount } from '@fuels/react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useChainId } from '../useChainId';
import { useMutationWithPolling } from '../useMutationWithPolling';
import { useMarketplace } from './useMarketplace';

export const useCreateOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { chainId } = useChainId();
  const { account } = useAccount();
  const { search } = useSearch({ strict: false });

  const address = account?.toLowerCase();

  const {
    mutate: createOrder,
    mutateAsync: createOrderAsync,
    ...rest
  } = useMutationWithPolling({
    mutationFn: async (order: OrderFromFuel) => {
      const marketplace = await marketplaceContract;
      return await marketplace.createOrder(order);
    },
    mutationOpts: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['nfts'] });
      },
    },
    pollConfigs: [
      {
        getQueryKey: () => [MarketplaceQueryKeys.USER_ORDERS, address],
        isDataReady: (
          data: InfiniteData<PaginationResult<Order>> | undefined,
          _,
          { orderId }
        ) => {
          if (!data) return true;
          const order = data.pages[0].data.find(
            (order) => order.id === orderId
          );

          return !!order;
        },
      },
      {
        getQueryKey: () => [
          MarketplaceQueryKeys.ALL_ORDERS,
          chainId,
          search ?? '',
        ],

        isDataReady: (
          data: InfiniteData<PaginationResult<Order>> | undefined,
          _,
          { orderId }
        ) => {
          if (!data) return true;

          const order = data.pages
            .flatMap((page) => page.data)
            .find((order) => order.id === orderId);

          return !!order;
        },
      },
    ],
  });

  return { createOrder, createOrderAsync, ...rest };
};
