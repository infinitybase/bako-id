import { contractsId } from '@bako-id/contracts';
import type { FuelAsset } from '../services/fuel-assets';
import { metadataArrayToObject, parseURI } from './formatter';
import { queryClient } from '../services/query-client';
import { QUERY_KEY_BACHTED_ASSETS } from '../hooks/useGetBatchedAssets';

const METADATA_MAP_KEY = 'nft-metadata';

const getMetadataMap = (): Map<string, Record<string, string>> => {
  const storedMap = localStorage.getItem(METADATA_MAP_KEY);
  if (!storedMap) return new Map();

  const parsed = JSON.parse(storedMap);
  return new Map(Object.entries(parsed));
};

const cacheNftMetadata = (
  nftAssetId: string,
  metadata: Record<string, string>
) => {
  const map = getMetadataMap();
  map.set(nftAssetId, metadata);
  const mapObject = Object.fromEntries(map);
  localStorage.setItem(METADATA_MAP_KEY, JSON.stringify(mapObject));
};

const getCachedNftMetadata = (
  nftAssetId: string
): Record<string, string> | null => {
  const map = getMetadataMap();
  return map.get(nftAssetId) || null;
};

const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
};

export const formatNftMetadata = async (data: FuelAsset[]) => {
  const nfts = data.filter((a) => !!a.isNFT) as (FuelAsset & {
    image?: string;
  })[];

  for (const nft of nfts) {
    let metadata: Record<string, string> = nft.metadata ?? {};
    const metadataEntries = Object.entries(metadata).filter(
      ([key]) => !['uri', 'image'].includes(key.toLowerCase())
    );
    const cachedNftMetadata = getCachedNftMetadata(nft.assetId);

    if (metadataEntries.length === 0 && nft.uri?.endsWith('.json')) {
      if (cachedNftMetadata && Object.keys(cachedNftMetadata).length > 0) {
        metadata = cachedNftMetadata;
      } else {
        const json: Record<string, string> = await fetch(parseURI(nft.uri))
          .then((res) => res.json())
          .catch(() => ({}));

        metadata = json;
      }
    }

    for (const [key, value] of Object.entries(metadata)) {
      if (Array.isArray(value)) {
        const metadataValueRecord = metadataArrayToObject(value, key);
        Object.assign(metadata, metadataValueRecord);
        delete metadata[key];
        continue;
      }

      if (metadata[key] === undefined) {
        const matadataValue = value as string;
        metadata[key] = matadataValue as string;
      }
    }

    nft.metadata = metadata;

    const image = Object.entries(metadata).find(([key]) =>
      key.includes('image')
    )?.[1];

    if (image) {
      const imageUrl = parseURI(image);
      nft.image = imageUrl;

      preloadImage(imageUrl);
    }

    if (nft.contractId === contractsId.mainnet.nft) {
      nft.collection = 'Bako ID';
    }

    if (!cachedNftMetadata && Object.keys(nft.metadata).length > 0) {
      cacheNftMetadata(nft.assetId, nft.metadata);
    }

    queryClient.setQueryData(
      QUERY_KEY_BACHTED_ASSETS(nft.assetId),
      nft.metadata
    );
  }

  return nfts.sort((a, b) => {
    if (a.image && !b.image) return -1;
    if (!a.image && b.image) return 1;
    return 0;
  });
};
