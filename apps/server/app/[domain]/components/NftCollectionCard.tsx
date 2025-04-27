import { Text, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';

import nftEmpty from '@/assets/nft-empty.png';
import type { FuelAsset } from '@/services/fuel-assets';
import { formatAddress, parseURI } from '@/utils';
import { NftCard } from './card';
import { NftCollectionCardModal } from './NftCollectionCardModal';

interface NftCollectionCardProps {
  asset: FuelAsset & { image?: string };
}

export const NftCollectionCard = (props: NftCollectionCardProps) => {
  const { name, assetId, metadata: defaultMetadata, symbol } = props.asset;
  const dialog = useDisclosure();

  const image = useMemo(() => {
    let imageUri = nftEmpty.src;

    if (defaultMetadata) {
      const imageKeys = ['image'];
      const imageKey = Object.keys(defaultMetadata).find((key) =>
        imageKeys.includes(key.split(':').at(0)!)
      );
      const nftImageURI = parseURI(defaultMetadata[imageKey!]);
      imageUri = nftImageURI || imageUri;
    }

    return imageUri;
  }, [defaultMetadata]);

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
