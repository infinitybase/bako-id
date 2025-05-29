import { Text, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';

import nftEmpty from '@/assets/nft-empty.png';
import type { FuelAsset } from '@/services/fuel-assets';
import { formatAddress } from '@/utils';
import { NftCollectionCardModal } from './NftCollectionCardModal';
import { NftCard } from './card';

interface NftCollectionCardProps {
  asset: FuelAsset & { image?: string };
}

export const NftCollectionCard = (props: NftCollectionCardProps) => {
  const { name, assetId, metadata: defaultMetadata, symbol } = props.asset;
  const dialog = useDisclosure();

  const image = useMemo(
    () => props.asset.image || nftEmpty.src,
    [props.asset.image]
  );

  const hasSrc20Name = name && symbol;

  const nftName = (
    <>
      {hasSrc20Name && `${symbol} ${name}`}
      {!hasSrc20Name && defaultMetadata?.name && defaultMetadata.name}
      {!hasSrc20Name && !defaultMetadata?.name && formatAddress(assetId)}
    </>
  );

  const edition = defaultMetadata?.edition;

  return (
    <>
      <NftCollectionCardModal
        assetId={props.asset.assetId}
        nftName={nftName}
        contractId={props.asset.contractId}
        metadata={defaultMetadata}
        image={image}
        isOpen={dialog.isOpen}
        onClose={dialog.onClose}
      />

      <NftCard.Root onClick={dialog.onOpen} cursor="pointer">
        {edition && <NftCard.EditionBadge edition={`#${edition}`} />}
        <NftCard.Image maxW="full" src={props.asset.image ?? image} />
        <NftCard.Content spacing={2}>
          <Text fontSize="sm">{nftName}</Text>
        </NftCard.Content>
      </NftCard.Root>
    </>
  );
};
