import { MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { Networks } from '@/utils/resolverNetwork';
import type { Collection } from '@/types/marketplace';
import { marketplaceService } from '@/services/marketplace';
import { useWallet } from '@fuels/react';

type useGetCollectionsProps = {
  page?: number;
  limit: number;
  search?: string;
  sortValue: string;
  sortDirection: 'asc' | 'desc';
};

export const useGetCollections = ({
  limit,
  search,
  sortValue,
  sortDirection,
}: useGetCollectionsProps) => {
  const { chainId, isLoading } = useChainId();
  const { wallet } = useWallet();
  const defaultChainId = !wallet && chainId === 0 ? Networks.MAINNET : chainId;


  const { data: collections, ...rest } = useInfiniteQuery<
    PaginationResult<Collection>
  >({
    queryKey: [
      MarketplaceQueryKeys.ALL_COLLECTIONS,
      defaultChainId,
      search,
      sortValue,
      sortDirection,
    ],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    queryFn: async ({ pageParam = 1 }) => {

      const { data } = await marketplaceService.listCollections({
        page: pageParam as number,
        limit,
        search,
        chainId: defaultChainId ?? Networks.MAINNET,
        sortValue,
        sortDirection,
      });

      return {
        data: data.items,
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        hasNextPage: data.pagination.hasNext,
        hasPreviousPage: data.pagination.hasPrev,
      };
    },
    placeholderData: (data) => data,
    enabled: !isLoading,
  });

  return { collections, ...rest };
};
