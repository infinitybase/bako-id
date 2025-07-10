'use client';

import nftEmpty from '@/assets/nft-empty.png';
import UnknownAsset from '@/assets/unknown-asset.png';
import type { Order } from '@/types/marketplace';
import { Button, Heading, Image, Text, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { NftSaleCardModal } from './NftSaleCardModal';
import { NftCard } from './card';
import { parseURI } from '@/utils';

interface NftSaleCardProps {
  order: Order;
  chainId: number;
}

const NftSaleCard = ({ order, chainId }: NftSaleCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currency = useMemo(
    () =>
      Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'USD',
      }).format(Number(order.price.usd)),
    [order.price.usd]
  );

  const assetSymbolUrl = order.price.image ?? UnknownAsset.src;

  const imageUrl = parseURI(order.asset.image) ?? nftEmpty.src;
  const name = order.asset.name ?? 'Unknown NFT';

  return (
    <NftCard.Root onClick={onOpen} cursor="pointer" minH="240px">
      {/* {nft.edition && <NftCard.EditionBadge edition={nft.edition} />} */}
      <NftCard.Image src={imageUrl} alt={name} />
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
          {order.price.amount}
        </Heading>
        {order.price.usd && (
          <Text color="grey.subtitle" fontSize="sm">
            {currency}
          </Text>
        )}
        <Button variant="primary" py={2} height="auto">
          Buy
        </Button>
      </NftCard.Content>

      {isOpen && (
        <NftSaleCardModal
          chainId={chainId}
          order={order}
          imageUrl={imageUrl}
          isOpen={isOpen}
          onClose={onClose}
          name={name}
          value={order.price.amount}
          usdValue={currency}
        />
      )}
    </NftCard.Root>
  );
};

export default NftSaleCard;
