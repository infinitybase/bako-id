import {
  OrderStatus,
  type Order as OrderWithMetadata,
} from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getOrderMetadata, type OrderResponse } from '@/utils/getOrderMetadata';
import type { PaginationResult } from '@/utils/pagination';
import type { Order } from '@bako-id/marketplace';
import { useAccount } from '@fuels/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';

export const useCreateOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { chainId } = useChainId();

  const {
    mutate: createOrder,
    mutateAsync: createOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (order: Order) => {
      const marketplace = await marketplaceContract;
      return await marketplace.createOrder(order);
    },
    onSuccess: async (response, payload) => {
      const previousOrders = queryClient.getQueriesData<
        PaginationResult<OrderWithMetadata>
      >({
        queryKey: [MarketplaceQueryKeys.ORDERS],
        exact: false,
      })[0][1] as PaginationResult<OrderWithMetadata>;

      const order: OrderResponse = {
        __typename: 'Order',
        amount: '1',
        asset: payload.sellAsset,
        itemAsset: payload.itemAsset,
        itemPrice: payload.sellPrice.toString(),
        seller: account!,
        status: OrderStatus.CREATED,
        id: String(response.orderId),
      };

      const newOrder = await getOrderMetadata(order, queryClient, chainId);

      const updatedOrders = [newOrder, ...(previousOrders.data ?? [])].slice(
        0,
        previousOrders.limit
      );

      queryClient.setQueriesData<PaginationResult<OrderWithMetadata>>(
        { queryKey: [MarketplaceQueryKeys.ORDERS], exact: false },
        (old) =>
          ({
            ...old,
            data: updatedOrders,
          }) as PaginationResult<OrderWithMetadata>
      );

      // refetch the nfts list
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
    },
  });

  return { createOrder, createOrderAsync, ...rest };
};
