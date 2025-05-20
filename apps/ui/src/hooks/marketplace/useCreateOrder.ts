import type { Order as OrderWithMetadata } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import type { Order } from '@bako-id/marketplace';
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
  const { page: pageUrl, search } = useSearch({ strict: false });

  const address = account?.toLowerCase();
  const page = Number(pageUrl || 1);

  const {
    mutate: createOrder,
    mutateAsync: createOrderAsync,
    ...rest
  } = useMutationWithPolling({
    mutationFn: async (order: Order) => {
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
        getQueryKey: () => [
          MarketplaceQueryKeys.ORDERS,
          address,
          page,
          chainId,
        ],
        isDataReady: (
          data: PaginationResult<OrderWithMetadata> | undefined,
          _,
          { orderId }
        ) => {
          if (!data) return true;
          const order = data.data.find((order) => order.id === orderId);

          return !!order;
        },
      },
      {
        getQueryKey: () => [
          MarketplaceQueryKeys.ALL_ORDERS,
          chainId,
          search ?? '',
        ],
        // @ts-expect-error - TODO: fix this type
        isDataReady: (
          data: InfiniteData<PaginationResult<OrderWithMetadata>> | undefined,
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
