import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { marketplaceService } from '@/services/marketplace';

export const useExecuteOrder = (collectionId: string) => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { chainId } = useChainId();

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

    onSuccess: async ({ txId }) => {
      queryClient.invalidateQueries({
        queryKey: [
          MarketplaceQueryKeys.COLLECTION_ORDERS,
          chainId,
          collectionId,
        ],
        exact: false
      });

      await marketplaceService.saveReceipt({
        txId,
        chainId: chainId ?? Networks.MAINNET,
      });
    },
  });

  return { executeOrder, executeOrderAsync, ...rest };
};
