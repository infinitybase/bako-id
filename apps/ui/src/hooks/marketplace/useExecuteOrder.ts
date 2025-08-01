import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';
import { MarketplaceQueryKeys } from '@/utils/constants';

export const useExecuteOrder = (collectionId: string) => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { chainId } = useChainId();
  const { addPurchasedOrder } = useProcessingOrdersStore();


  const {
    mutate: executeOrder,
    mutateAsync: executeOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      await marketplace.executeOrder(orderId);

      return orderId;
    },

    onSuccess: async (orderId) => {
      queryClient.invalidateQueries({
        queryKey: [
          MarketplaceQueryKeys.COLLECTION_ORDERS,
          chainId,
          collectionId,
        ],
      });
      addPurchasedOrder(orderId);
    },
  });

  return { executeOrder, executeOrderAsync, ...rest };
};
