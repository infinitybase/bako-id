import { getAssetsByOwner } from 'fuels';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { formatNftMetadata } from '../utils/formatNftMetadata';

const networkResolver: Record<number, 'mainnet' | 'testnet'> = {
  0: 'testnet',
  9889: 'mainnet',
};

export const useGetPaginatedAssets = (
  address: string,
  chainId: number | null
) => {
  const PAGE_SIZE = 11;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['assets', address],
    queryFn: async ({ pageParam = 0 }) => {
      // Calculate how many items to fetch based on what we already have
      const fetchSize = pageParam + PAGE_SIZE;

      const result = await getAssetsByOwner({
        owner: address,
        network: networkResolver[chainId!],
        pagination: {
          last: fetchSize,
        },
      });

      // Extract just the new items for this page
      const allAssets = result.data || [];
      const startIndex = Math.max(0, pageParam);
      const pageAssets = allAssets.slice(startIndex, fetchSize);

      const nfts = await formatNftMetadata(pageAssets);

      return {
        assets: pageAssets,
        nfts,
        nextCursor: fetchSize,
      };
    },
    getNextPageParam: (lastPage) => {
      // If we got fewer items than requested, we've reached the end
      if (lastPage.assets.length < PAGE_SIZE - 1) {
        return undefined; // No more pages
      }
      return lastPage.nextCursor;
    },
    initialPageParam: 0,
    enabled: !!address,
    // select: (data) => data?.pages[0].assets.filter((a) => !!a.isNFT)
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, loadMoreRef.current]);

  const assetsResult = data?.pages.flatMap((page) => page.nfts) || [];

  return {
    assets: assetsResult,
    status,
    loadMoreRef,
    observerRef,
    isLoadingAssets: isLoading,
  };
};
