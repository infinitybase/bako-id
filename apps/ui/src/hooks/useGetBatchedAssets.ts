import { getAssetsByOwner } from 'fuels';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { formatNftMetadata } from '../utils/formatNftMetadata';
import {
  NFTCollectionPaginator,
  type Nft,
} from '../services/nftCollectionPaginator';

const networkResolver: Record<number, 'mainnet' | 'testnet'> = {
  0: 'testnet',
  9889: 'mainnet',
};

export const QUERY_KEY_BACHTED_ASSETS = (address: string) => [
  'assetsBatch',
  address,
];

export const useGetBatchedAssets = (
  address: string,
  chainId: number | null
) => {
  const PAGE_SIZE = 5;
  const BATCH_SIZE = 200;
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data: allAssets, isLoading } = useQuery({
    queryKey: QUERY_KEY_BACHTED_ASSETS(address),
    queryFn: async () => {
      const result = await getAssetsByOwner({
        owner: address,
        network: networkResolver[chainId!],
        pagination: {
          last: BATCH_SIZE,
        },
      });

      const nfts = await formatNftMetadata(result.data || []);
      console.log({ nfts });

      return nfts;
    },
  });

  let visibleAssets: {
    name: string | null;
    assets: Nft[];
  }[] = [];

  if (allAssets?.length) {
    const priorityCollections = ['Bako ID', 'Executoors'];
    const paginator = new NFTCollectionPaginator(
      allAssets ?? [],
      priorityCollections
    );
    const result = paginator.getNextBatchesUntilCount(displayCount);

    const formattedResult = result.collections.map((collection) => {
      return {
        name:
          collection.collectionName === 'null'
            ? 'Other'
            : collection.collectionName,
        assets: collection.nfts,
      };
    });

    visibleAssets = formattedResult;
  }
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
