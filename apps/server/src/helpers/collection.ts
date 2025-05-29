import type { FuelAsset } from '@/services/fuel-assets';
import { groupBy } from 'lodash';
import type { NFTWithImage } from '../hooks/useCollections';
import { BAKO_CONTRACTS_IDS } from './constant';

export type NFTCollection = {
  name: string;
  assets: NFTWithImage[];
};

export function determineCollection(nft: FuelAsset) {
  if (nft.contractId && BAKO_CONTRACTS_IDS.includes(nft.contractId)) {
    return 'Bako ID';
  }

  return nft.collection;
}

export function groupNftsByCollection(nfts: NFTWithImage[]): NFTCollection[] {
  const groupedNfts = groupBy(nfts, 'collection');

  return Object.entries(groupedNfts)
    .map(([name, assets]) => ({
      name: name !== 'null' ? name : 'Other',
      assets,
    }))
    .sort((a, b) => {
      if (a.name === 'Bako ID') return -1;
      if (b.name === 'Bako ID') return 1;
      if (a.name === 'Other') return 1;
      if (b.name === 'Other') return -1;
      return a.name.localeCompare(b.name);
    });
}
