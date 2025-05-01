import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatNftMetadata } from '../utils/formatNftMetadata';
import {
  NFTCollectionPaginator,
  type Nft,
} from '../services/nftCollectionPaginator';
import { FuelAssetService } from '../services/fuel-assets';

export const QUERY_KEY_BACHTED_ASSETS = (address: string) => [
  'assetsBatch',
  address,
];

const PAGE_SIZE = 10;

interface VisibleAssets {
  name: string | null;
  assets: Nft[];
}

export const useGetBatchedAssets = (
  address: string,
  chainId: number | null
) => {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data: allAssets, isLoading } = useQuery({
    queryKey: QUERY_KEY_BACHTED_ASSETS(address),
    queryFn: async () => {
      const result = await FuelAssetService.byAddress({
        address,
        chainId: chainId ?? 9889,
      });

      const nfts = await formatNftMetadata(result?.data || []);

      return nfts;
    },
  });

  const visibleAssets = useMemo(() => {
    if (!allAssets?.length) return [];

    const priorityCollections = ['Bako ID', 'Executoors'];
    const paginator = new NFTCollectionPaginator(
      allAssets ?? [],
      priorityCollections
    );
    const result = paginator.getNextBatchesUntilCount(displayCount);

    //  Instead of creating a repeated Collection due the pagination, merge them
    const mergedCollections = result.collections.reduce<
      Record<string, VisibleAssets>
    >((acc, collection) => {
      const collectionName =
        collection.collectionName === 'null'
          ? 'Other'
          : collection.collectionName;

      if (acc[collectionName!]) {
        acc[collectionName!].assets.push(...collection.nfts);
      } else {
        acc[collectionName!] = {
          name: collectionName,
          assets: [...collection.nfts],
        };
      }

      return acc;
    }, {});

    return Object.values(mergedCollections);
  }, [allAssets, displayCount]);

  const hasMore = allAssets ? displayCount < allAssets.length : false;

  const loadMoreAssets = () => {
    if (!hasMore || isLoading) return;

    setDisplayCount((prev) => prev + PAGE_SIZE);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          loadMoreAssets();
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
  }, [loadMoreRef.current, hasMore, isLoading]);

  return {
    assets: visibleAssets,
    loadMoreRef,
    observerRef,
    isLoadingAssets: isLoading,
  };
};
