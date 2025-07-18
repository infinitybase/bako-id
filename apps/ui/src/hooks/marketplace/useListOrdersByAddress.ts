import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';
import type { Order } from '@/types/marketplace';
import type { PaginationResult } from '@/utils/pagination';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { useChainId } from '../useChainId';

type useListOrdersByAddressProps = {
  page?: number;
  limit?: number;
  sellerAddress: string;
};

type UserOrdersResponse = PaginationResult<Order> & {
  totalOrdersUsdPrice: number;
  notListedTotalUsdPrice: number;
};

export const useListOrdersByAddress = ({
  sellerAddress,
  page = 0,
  limit,
}: useListOrdersByAddressProps) => {
  const { chainId } = useChainId();
  const {
    data: orders,
    isLoading: isLoadingOrders,
    ...rest
  } = useQuery<UserOrdersResponse>({
    queryKey: [
      MarketplaceQueryKeys.USER_ORDERS,
      sellerAddress,
      page,
      limit,
      chainId,
    ],
    queryFn: async () => {
      const { data } = await marketplaceService.listUserOrders({
        page: page,
        chainId: chainId ?? Networks.MAINNET,
        limit: limit ?? 10,
        sellerAddress,
      });

      return {
        data: data.items,
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        hasNextPage: data.pagination.hasNext,
        hasPreviousPage: data.pagination.hasPrev,
        totalOrdersUsdPrice: data.totalOrdersUsdPrice,
        notListedTotalUsdPrice: data.notListedTotalUsdPrice,
      };
    },
    placeholderData: (data) => data,
    enabled: !!chainId && !!sellerAddress,
  });

  return {
    orders,
    isLoading: !sellerAddress ? true : isLoadingOrders,
    ...rest,
  };
};
