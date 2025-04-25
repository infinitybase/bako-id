import { useProfile } from '@/modules/profile/hooks/useProfile';
import type { Order } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getAssetMetadata } from '@/utils/getOrderMetadata';
import type { PaginationResult } from '@/utils/pagination';
import type { UpdateOrder } from '@bako-id/marketplace';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';

export const useUpdateOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { chainId } = useChainId();
  const { domain } = useProfile();
  const { page } = useSearch({ strict: false });

  const address = domain?.Address?.bits || domain?.ContractId?.bits;

  const {
    mutate: updateOrder,
    mutateAsync: updateOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async ({
      orderId,
      ...data
    }: UpdateOrder & { orderId: string }) => {
      const marketplace = await marketplaceContract;
      return await marketplace.updateOrder(orderId, data);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: async (_, payload) => {
      const _page = page ?? 1;
      const previousOrders = queryClient.getQueryData<PaginationResult<Order>>([
        MarketplaceQueryKeys.ORDERS,
        address,
        _page,
      ]);

      if (previousOrders) {
        const orderAssetMetadata = await getAssetMetadata(
          payload.sellAsset,
          chainId
        );
        const mergedOrders = previousOrders.data.map((order) => {
          if (order.id === payload.orderId) {
            return {
              ...order,
              asset: orderAssetMetadata
                ? { ...orderAssetMetadata, id: String(order.asset?.id) }
                : null,
              itemPrice: payload.sellPrice.toString(),
            };
          }
          return order;
        });

        queryClient.setQueriesData<PaginationResult<Order>>(
          {
            queryKey: [MarketplaceQueryKeys.ORDERS],
            exact: false,
          },
          { ...previousOrders, data: mergedOrders }
        );
      }
    },
  });

  return { updateOrder, updateOrderAsync, ...rest };
};
