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
import { Networks } from '@/utils/resolverNetwork';
import { marketplaceService } from '@/services/marketplace';
import type { PaginationResult } from '@/utils/pagination';
import type { Order } from '@/types/marketplace';

export const useCancelOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { chainId } = useChainId();
  const address = account?.toLowerCase() ?? '';
  // console.log('address', address);

  const { addCancelledOrders } = useProcessingOrdersStore();

  const {
    mutate: cancelOrder,
    mutateAsync: cancelOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      const { transactionResult } = await marketplace.cancelOrder(orderId);
      return { orderId, txId: transactionResult.id };
    },

    onSuccess: async ({ orderId, txId }) => {
      await queryClient.invalidateQueries({
        queryKey: [BakoIDQueryKeys.NFTS, chainId, address],
      });

      addCancelledOrders({ orderId, owner: address, txId });

      await queryClient.invalidateQueries({
        queryKey: [MarketplaceQueryKeys.USER_ORDERS, address],
      });

      await marketplaceService.saveReceipt({
        txId,
        chainId: chainId ?? Networks.MAINNET,
      });

      queryClient.setQueryData(
        [MarketplaceQueryKeys.USER_ORDERS, address],
        (old: InfiniteData<PaginationResult<Order>, unknown>) => {

          return {
            ...old,
            pages: old.pages.map((page) => {
              const result = {
                ...page,
                data: page.data.filter((item) => item.id !== orderId),
              };
              return result;
            }),
          };
        }
      );


    },
  });

  return { cancelOrder, cancelOrderAsync, ...rest };
};
