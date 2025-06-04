import { FuelAssetService, type FuelAsset } from '@/services/fuel-assets';
import { determineCollection, groupNftsByCollection } from '@/utils/collection';
import {
  BakoIDQueryKeys,
  COLLECTION_ASSETS_METADATA_STORAGE_KEY,
} from '@/utils/constants';
import {
  fetchMetadata,
  formatMetadataFromIpfs,
  parseURI,
} from '@/utils/formatter';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage';
import { useQuery } from '@tanstack/react-query';
import { chunk, isNil } from 'lodash';
import { useChainId } from './useChainId';

export type NFTWithImage = FuelAsset & {
  image?: string;
};

type UseCollectionsProps = {
  address: string;
  page: number;
  pageSize?: number;
};

type NFTMetadata = Record<string, string>;
type CachedMetadata = Record<string, NFTMetadata>;

const PAGE_SIZE = 18;

export const useCollections = ({
  address,
  page,
  pageSize = PAGE_SIZE,
}: UseCollectionsProps) => {
  const { chainId } = useChainId();

  const { data: allNfts, isLoading: isLoadingAllNfts } = useQuery({
    queryKey: [BakoIDQueryKeys.NFTS, chainId, address],
    queryFn: async () => {
      const { data } = await FuelAssetService.byAddress({
        address,
        chainId: chainId!,
      });

      return data.filter(
        (a) => !!a.isNFT && Number(a.amount) > 0
      ) as NFTWithImage[];
    },
    enabled: !isNil(chainId),
  });

  const totalPages = allNfts ? Math.ceil(allNfts.length / pageSize) : 0;

  const currentPageNfts = allNfts
    ? chunk(allNfts, pageSize)[page - 1] || []
    : [];

  const {
    data: nftsWithMetadata,
    isLoading: isLoadingMetadata,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      BakoIDQueryKeys.NFTS_METADATA,
      chainId,
      address,
      page,
      currentPageNfts.map((nft) => nft.assetId),
    ],
    queryFn: async () => {
      const localStorageCache =
        getLocalStorage<CachedMetadata>(
          COLLECTION_ASSETS_METADATA_STORAGE_KEY
        ) || {};

      const metadataToSave: CachedMetadata = {};

      const processedNfts = await Promise.all(
        currentPageNfts.map(async (nft) => {
          const localStorageMetadata = localStorageCache[nft.assetId];

          if (localStorageMetadata) {
            const metadata = localStorageMetadata;
            const collection = determineCollection(nft);

            const image = metadata
              ? Object.entries(metadata).find(([key]) =>
                  key.includes('image')
                )?.[1]
              : undefined;

            return {
              ...nft,
              metadata: metadata as Record<string, string>,
              image: image ? parseURI(image) : nft.image,
              collection,
            };
          }

          let metadata: Record<string, string> = nft.metadata ?? {};
          const metadataEntries = Object.entries(metadata).filter(
            ([key]) => !['uri', 'image'].includes(key.toLowerCase())
          );

          if (metadataEntries.length === 0 && nft.uri) {
            metadata = await fetchMetadata(nft.uri);
          }

          const formattedMetadata = formatMetadataFromIpfs(metadata);
          const image = Object.entries(formattedMetadata).find(([key]) =>
            key.includes('image')
          )?.[1];
          const collection = determineCollection(nft);

          metadataToSave[nft.assetId] = formattedMetadata;

          return {
            ...nft,
            metadata: formattedMetadata,
            image: image ? parseURI(image) : undefined,
            collection,
          };
        })
      );

      if (Object.keys(metadataToSave).length > 0) {
        const existingCache =
          getLocalStorage<CachedMetadata>(
            COLLECTION_ASSETS_METADATA_STORAGE_KEY
          ) || {};
        setLocalStorage(COLLECTION_ASSETS_METADATA_STORAGE_KEY, {
          ...existingCache,
          ...metadataToSave,
        });
      }

      return processedNfts.sort((a, b) => {
        if (a.image && !b.image) return -1;
        if (!a.image && b.image) return 1;
        return 0;
      });
    },
    enabled: !isNil(chainId) && currentPageNfts.length > 0,
    placeholderData: (prev) => prev,
  });

  const collections = nftsWithMetadata
    ? groupNftsByCollection(nftsWithMetadata)
    : [];

  return {
    nfts: nftsWithMetadata || [],
    collections,
    totalPages,
    isLoading: isLoadingAllNfts || isLoadingMetadata,
    currentPage: page,
    isPlaceholderData,
  };
};
