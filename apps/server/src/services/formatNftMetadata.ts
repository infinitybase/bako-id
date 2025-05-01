import { contractsId } from '@bako-id/contracts';
import type { FuelAsset } from '../services/fuel-assets';
import { metadataArrayToObject, parseURI } from '@/utils';
import { queryClient } from '@/providers';
import { QUERY_KEY_BACHTED_ASSETS } from '@/hooks/useGetBatchedAssets';

const NFT_IMAGE_CACHE = 'nft-images-cache-v1';

const cacheNftMetadata = (
  nftAssetId: string,
  metadata: Record<string, string>
) => {
  const verifyCachedNft = localStorage.getItem(nftAssetId);

  if (verifyCachedNft) {
    return;
  }
  localStorage.setItem(nftAssetId, JSON.stringify(metadata));
};

const getCachedNftMetadata = (nftAssetId: string) => {
  const cachedData = localStorage.getItem(nftAssetId);

  if (!cachedData) return null;

  try {
    const parsed = JSON.parse(cachedData);
    return parsed &&
      typeof parsed === 'object' &&
      Object.keys(parsed).length > 0
      ? parsed
      : null;
  } catch {
    return null;
  }
};

async function fetchWithCache(url: string): Promise<Blob> {
  // Check if Cache API is available (browser environment)
  if (typeof caches === 'undefined') {
    return fetch(url).then((res) => res.blob());
  }

  try {
    const cache = await caches.open(NFT_IMAGE_CACHE);

    const cachedResponse = await cache.match(url);

    if (cachedResponse) {
      return cachedResponse.blob();
    }

    const response = await fetch(url);

    // Need to clone the response to avoid error "body already consumed"
    const responseClone = response.clone();

    cache.put(url, responseClone);

    return response.blob();
  } catch (error) {
    console.error(`Cache error for ${url}:`, error);

    return fetch(url).then((res) => res.blob());
  }
}

async function preloadImage(url: string): Promise<string> {
  try {
    await fetchWithCache(url);
    return url;
  } catch (error) {
    console.error(`Failed to preload image: ${url}`, error);
    return url;
  }
}

export const formatNftMetadata = async (
  data: FuelAsset[],
  network: 'testnet' | 'mainnet'
) => {
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
      if (cachedNftMetadata) {
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

    if (nft.contractId === contractsId[network].nft) {
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
