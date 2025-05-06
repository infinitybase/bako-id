import { useProfile } from '@/modules/profile/hooks/useProfile';
import type { Order as OrderWithMetadata } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import type { Order } from '@bako-id/marketplace';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useChainId } from '../useChainId';
import { useMutationWithPolling } from '../useMutationWithPolling';
import { useMarketplace } from './useMarketplace';

export const useCreateOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { chainId } = useChainId();
  const { domain } = useProfile();
  const { page: pageUrl, search } = useSearch({ strict: false });

  const address = domain?.Address?.bits || domain?.ContractId?.bits;
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
          // prevents the infinite loop when the order is not found in the cache
          if (!data) return true;
          console.log('profile', orderId, data);
          const order = data.data.find((order) => order.id === orderId);
          console.log('order', order);

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
          // prevents the infinite loop when the order is not found in the cache
          if (!data) return true;

          console.log('all', orderId, data);
          const order = data.pages
            .flatMap((page) => page.data)
            .find((order) => order.id === orderId);
          console.log('order', order);

          return !!order;
        },
      },
    ],
  });

  return { createOrder, createOrderAsync, ...rest };
};
