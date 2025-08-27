import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { marketplaceService } from '@/services/marketplace';

export const useExecuteOrder = (collectionId: string, setTxId?: (txId: string) => void) => {
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
      const { transactionResult } = await marketplace.executeOrder(orderId);

      return { orderId, txId: transactionResult.id };
    },

    onSuccess: async ({ orderId, txId }) => {
      queryClient.invalidateQueries({
        queryKey: [
          MarketplaceQueryKeys.COLLECTION_ORDERS,
          chainId,
          collectionId,
        ],
        exact: false
      });
      if (!setTxId) {
        addPurchasedOrder(orderId, txId);
      }
      await marketplaceService.saveReceipt({
        txId,
        chainId: chainId ?? Networks.MAINNET,
      });
      setTxId?.(txId);
    },
  });

  return { executeOrder, executeOrderAsync, ...rest };
};
