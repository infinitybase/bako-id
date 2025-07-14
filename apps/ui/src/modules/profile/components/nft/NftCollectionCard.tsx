import { Button, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';

import nftEmpty from '@/assets/nft-empty.png';
import type { NFTWithImage } from '@/hooks/useCollections';
import type { Asset } from '@/types/marketplace';
import { BAKO_CONTRACTS_IDS } from '@/utils/constants';
import { formatAddress } from '@/utils/formatter';
import { NftCardModal } from './NftCardModal';
import { NftCard } from './card';

interface NftCollectionCardProps {
  asset: NFTWithImage;
  assets: Asset[];
  resolver: string;
  isOwner: boolean;
  ctaButtonVariant?: 'primary' | 'mktPrimary';
}

export const NftCollectionCard = (props: NftCollectionCardProps) => {
  const {
    name,
    contractId,
    assetId,
    metadata: defaultMetadata,
    collection,
    symbol,
  } = props.asset;
  const dialog = useDisclosure();

  const image = useMemo(
    () => props.asset.image || nftEmpty,
    [props.asset.image]
  );

  const hasSrc20Name = name && symbol;
  const isBakoIdNft = useMemo(
    () => BAKO_CONTRACTS_IDS.includes(contractId!),
    [contractId]
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
        isOwner={props.isOwner}
        collection={collection}
        ctaButtonVariant={props.ctaButtonVariant}
      />

      <NftCard.Root onClick={dialog.onOpen} cursor="pointer">
        {edition && <NftCard.EditionBadge edition={`#${edition}`} />}
        <NftCard.Image maxW="full" src={props.asset.image ?? image} />
        <NftCard.Content spacing={2}>
          <Text
            fontSize="sm"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
            maxW="130px"
          >
            {nftName}
          </Text>

          {props.isOwner && (
            <Tooltip
              label={isBakoIdNft ? 'This NFT is not allowed to be sold' : ''}
            >
              <Button
                mt={2}
                disabled={isBakoIdNft}
                variant={props.ctaButtonVariant ?? 'primary'}
                size="sm"
              >
                List
              </Button>
            </Tooltip>
          )}
        </NftCard.Content>
      </NftCard.Root>
    </>
  );
};
