import { Button, Text, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';

import nftEmpty from '@/assets/nft-empty.png';
import type { FuelAsset } from '@/services/fuel-assets';
import type { Asset } from '@/types/marketplace';
import { formatAddress, parseURI } from '@/utils/formatter';
import { useWallet } from '@fuels/react';
import { NftCardModal } from './NftCardModal';
import { NftCard } from './card';

interface NftCollectionCardProps {
  asset: FuelAsset & { image?: string };
  assets: Asset[];
}

export const NftCollectionCard = (props: NftCollectionCardProps) => {
  const {
    name,
    contractId,
    assetId,
    metadata: defaultMetadata,
    symbol,
  } = props.asset;
  const dialog = useDisclosure();
  const { wallet } = useWallet();

  // const { data: metadata } = useQuery({
  //   queryKey: ['nft-metadata', assetId],
  //   queryFn: async (): Promise<Record<string, string>> => {
  //     let metadata: Record<string, string> = defaultMetadata ?? {};
  //     const metadataEntries = Object.entries(metadata).filter(
  //       ([key]) => !key.toLowerCase().includes('uri')
  //     );

  //     if (
  //       (metadataEntries.length === 0 && uri?.endsWith('.json')) ||
  //       defaultMetadata?.uri?.endsWith('.json')
  //     ) {
  //       const input = defaultMetadata?.uri ?? uri;
  //       const json: Record<string, string> = await fetch(parseURI(input!))
  //         .then((res) => res.json())
  //         .catch(() => ({}));
  //       metadata = json;
  //     }

  //     for (const [key, value] of Object.entries(metadata)) {
  //       if (Array.isArray(value)) {
  //         const metadataValueRecord = metadataArrayToObject(value, key);
  //         Object.assign(metadata, metadataValueRecord);
  //         delete metadata[key];
  //         continue;
  //       }

  //       if (metadata[key] === undefined) {
  //         const matadataValue = value as string;
  //         metadata[key] = matadataValue as string;
  //       }
  //     }

  //     return metadata;
  //   },
  //   enabled: !!assetId,
  //   refetchOnWindowFocus: false,
  // });

  const image = useMemo(() => {
    let imageUri = nftEmpty;

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
  const ownerDomain = wallet?.address.b256Address;
  const isOwner = useMemo(
    () => ownerDomain === props.asset.owner,
    [ownerDomain, props.asset.owner]
  );

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
      <NftCardModal
        assets={props.assets}
        assetId={assetId}
        nftName={nftName}
        contractId={contractId}
        metadata={defaultMetadata}
        image={image}
        isOpen={dialog.isOpen}
        onClose={dialog.onClose}
        isOwner={isOwner}
      />

      <NftCard.Root onClick={dialog.onOpen} cursor="pointer">
        {edition && <NftCard.EditionBadge edition={`#${edition}`} />}
        <NftCard.Image maxW="full" src={props.asset.image ?? image} />
        <NftCard.Content spacing={2}>
          <Text fontSize="sm">{nftName}</Text>

          {isOwner && (
            <Button mt={2} variant="primary" size="sm">
              Sell
            </Button>
          )}
        </NftCard.Content>
      </NftCard.Root>
    </>
  );
};
