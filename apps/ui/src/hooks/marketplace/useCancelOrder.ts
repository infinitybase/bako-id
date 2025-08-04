import { BakoIDQueryKeys, MarketplaceQueryKeys } from '@/utils/constants';
import { useAccount } from '@fuels/react';
import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';
import type { Order } from '@/types/marketplace';
import type { PaginationResult } from '@/utils/pagination';

export const useCancelOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { chainId } = useChainId();
  const address = account?.toLowerCase() ?? '';

  const { addCancelledOrders } = useProcessingOrdersStore();


  const {
    mutate: cancelOrder,
    mutateAsync: cancelOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      await marketplace.cancelOrder(orderId);
      return orderId;
    },

    onSuccess: async (cancelledOrderid) => {
      await queryClient.invalidateQueries({
        queryKey: [BakoIDQueryKeys.NFTS, chainId, address],
      });

      addCancelledOrders(cancelledOrderid, address);
      queryClient.setQueryData(
        [MarketplaceQueryKeys.USER_ORDERS, address],
        (old: InfiniteData<PaginationResult<Order>, unknown>) => {
          return {
            ...old,
            pages: old.pages.map((page) => {
              return {
                ...page,
                items: page.data.filter(
                  (item) => item.id !== cancelledOrderid
                ),
              };
            }),
          };
        }
      );
    },
  });

  return { cancelOrder, cancelOrderAsync, ...rest };
};
