import { contractsId } from '@bako-id/contracts';
import type { FuelAsset } from '../services/fuel-assets';
import { metadataArrayToObject, parseURI } from './formatter';
import type { AssetInfo } from 'fuels';
import { queryClient } from '../services/query-client';

export const formatNftMetadata = async (data: AssetInfo[]) => {
  console.log('starting');

  const nfts = data.filter((a) => !!a.isNFT) as (FuelAsset & {
    image?: string;
  })[];

  for (const nft of nfts) {
    let metadata: Record<string, string> = nft.metadata ?? {};
    const metadataEntries = Object.entries(metadata).filter(
      ([key]) => !key.toLowerCase().includes('uri')
    );

    if (metadataEntries.length === 0 && nft.uri?.endsWith('.json')) {
      const json: Record<string, string> = await fetch(parseURI(nft.uri))
        .then((res) => res.json())
        .catch(() => ({}));
      metadata = json;
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
    nft.image = image ? parseURI(image) : undefined;

    if (nft.contractId === contractsId.mainnet.nft) {
      nft.collection = 'Bako ID';
    }

    queryClient.setQueryData(['assets', nft.assetId], nft.metadata);
  }

  return nfts.sort((a, b) => {
    if (a.image && !b.image) return -1;
    if (!a.image && b.image) return 1;
    return 0;
  });
};
