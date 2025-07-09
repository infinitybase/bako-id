/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import nftEmpty from '@/assets/nft-empty.png';
import UnknownAsset from '@/assets/unknown-asset.png';
import { ConfirmationDialog, useCustomToast } from '@/components';
import { useCancelOrder } from '@/hooks/marketplace';
import {
  type BoxProps,
  Button,
  Heading,
  Image,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useMemo, type MouseEvent } from 'react';
import { NftSaleCardModal } from './NftSaleCardModal';
import { NftCard } from './card';
import { parseURI } from '@/utils/formatter';
import type { Order } from '@/types/marketplace';

interface NftSaleCardProps {
  order: Order;
  showDelistButton: boolean;
  isOwner: boolean;
  showBuyButton: boolean;
  withHandle: boolean;
  openModalOnClick?: boolean;
  imageSize?: BoxProps['boxSize'];
}

const NftSaleCard = ({
  order,
  showDelistButton,
  isOwner,
  showBuyButton,
  openModalOnClick = true,
  withHandle,
  imageSize,
}: NftSaleCardProps) => {
  const { successToast, errorToast } = useCustomToast();
  const { cancelOrderAsync, isPending: isCanceling } = useCancelOrder();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const delistModal = useDisclosure();

  const handleCancelOrder = useCallback(async () => {
    try {
      await cancelOrderAsync(order.id);
      successToast({
        title: 'Delisted successfully',
        description: 'Your order has been successfully cancelled.',
      });
      onClose();
    } catch {
      errorToast({
        title: 'Error delisting order',
        description: 'An error occurred while delisting your order.',
      });
    }
  }, [cancelOrderAsync, order.id, successToast, errorToast, onClose]);

  const handleDelist = (e: MouseEvent) => {
    e.stopPropagation();
    delistModal.onOpen();
  };

  const handleConfirmDelist = async () => {
    await handleCancelOrder();
    delistModal.onClose();
  };

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

  const assetSymbolUrl = order.price.image || UnknownAsset;

  const imageUrl = parseURI(order.asset?.image) || nftEmpty;
  const name = order.asset.name || 'Unknown NFT';

  const handleCardClick = () => {
    if (openModalOnClick) {
      onOpen();
    }
  };

  return (
    <NftCard.Root onClick={handleCardClick} cursor="pointer" minH="240px">
      {/* {order.nft?.edition && (
        <NftCard.EditionBadge edition={order.nft?.edition} />
      )} */}
      {showDelistButton && <NftCard.DelistButton onDelist={handleDelist} />}
      <NftCard.Image boxSize={imageSize} src={imageUrl} />
      <NftCard.Content spacing={2}>
        <Text
          fontSize="sm"
          color="text.700"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {name}
        </Text>
        <Heading
          display="flex"
          alignItems="center"
          gap={1}
          fontSize="md"
          color="text.700"
        >
          <Tooltip label={order.asset?.name}>
            <Image src={assetSymbolUrl} alt="Asset Icon" w={4} height={4} />
          </Tooltip>
          {order.price.amount}
        </Heading>
        {order.price.usd && (
          <Text color="grey.subtitle" fontSize="sm">
            {currency}
          </Text>
        )}

        {showBuyButton && (
          <Button height="auto" py={1.5} variant="primary">
            Buy
          </Button>
        )}
      </NftCard.Content>
      {delistModal.isOpen && (
        <ConfirmationDialog
          title="Delist NFT"
          isOpen
          onClose={delistModal.onClose}
          onConfirm={handleConfirmDelist}
          isConfirming={isCanceling}
          confirmActionVariant="tertiary"
          confirmActionLabel="Yes, delist NFT"
        >
          <Text fontSize="sm" color="grey.subtitle">
            Are you sure you want to delist this NFT?
          </Text>
        </ConfirmationDialog>
      )}
      {isOpen && (
        <NftSaleCardModal
          order={order}
          imageUrl={imageUrl}
          isOpen={isOpen}
          onClose={onClose}
          onCancelOrder={handleCancelOrder}
          isCanceling={isCanceling}
          value={order.price.amount}
          usdValue={currency}
          isOwner={isOwner}
          withHandle={withHandle}
        />
      )}
    </NftCard.Root>
  );
};

export default NftSaleCard;
