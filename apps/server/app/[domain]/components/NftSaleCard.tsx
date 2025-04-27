'use client';

import nftEmpty from '@/assets/nft-empty.png';
import UnknownAsset from '@/assets/unknown-asset.png';
import type { FuelAsset } from '@/services/fuel-assets';
import type { Nft } from '@/types/marketplace';
import { Heading, Image, Text, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { NftCard } from './card';
import { NftSaleCardModal } from './NftSaleCardModal';

interface NftSaleCardProps {
  orderId: string;
  asset: (FuelAsset & { id: string }) | null;
  value: string;
  nft: Nft;
}

const NftSaleCard = ({ value, orderId, nft, asset }: NftSaleCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const rate = asset?.rate ?? 0;

  const usdValue = useMemo(() => Number(value) * rate, [value, rate]);

  const currency = useMemo(
    () =>
      Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'USD',
      }).format(Number(usdValue)),
    [usdValue]
  );

  const nftPrice = useMemo(() => Number(value), [value]);

  const valueWithoutRigthZeros = useMemo(
    () => Number(value).toString(),
    [value]
  );

  const assetSymbolUrl = asset?.icon ?? UnknownAsset.src;

  const imageUrl = nft.image ?? nftEmpty.src;
  const name = nft.name ?? 'Unknown NFT';

  return (
    <NftCard.Root onClick={onOpen} cursor="pointer">
      {nft.edition && <NftCard.EditionBadge edition={nft.edition} />}
      <NftCard.Image src={imageUrl} />
      <NftCard.Content spacing={2}>
        <Text fontSize="sm" color="text.700">
          {name}
        </Text>
        <Heading
          display="flex"
          alignItems="center"
          gap={1}
          fontSize="md"
          color="text.700"
        >
          <Image src={assetSymbolUrl} alt="Asset Icon" w={4} height={4} />
          {nftPrice}
        </Heading>
        {asset?.rate && (
          <Text color="grey.subtitle" fontSize="sm">
            {currency}
          </Text>
        )}
      </NftCard.Content>

      {isOpen && (
        <NftSaleCardModal
          orderId={orderId}
          imageUrl={imageUrl}
          isOpen={isOpen}
          onClose={onClose}
          nft={nft}
          name={name}
          value={valueWithoutRigthZeros}
          asset={{
            iconUrl: assetSymbolUrl,
            decimals: asset?.decimals,
            id: asset?.id!,
            name: asset?.name ?? 'Unknown',
          }}
          usdValue={currency}
        />
      )}
    </NftCard.Root>
  );
};

export default NftSaleCard;
