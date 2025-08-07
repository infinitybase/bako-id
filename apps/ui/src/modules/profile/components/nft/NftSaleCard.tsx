/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import nftEmpty from '@/assets/nft-empty.png';
import UnknownAsset from '@/assets/unknown-asset.png';
import { ConfirmationDialog, useCustomToast } from '@/components';
import { useCancelOrder } from '@/hooks/marketplace';
import type { Order } from '@/types/marketplace';
import { parseURI } from '@/utils/formatter';
import {
  type BoxProps,
  Button,
  Heading,
  Image,
  Skeleton,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { type MouseEvent, useCallback, useMemo } from 'react';
import { NftSaleCardModal } from './NftSaleCardModal';
import { NftCard } from './card';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';

interface NftSaleCardProps {
  order: Order;
  showDelistButton: boolean;
  isOwner: boolean;
  showBuyButton: boolean;
  withHandle: boolean;
  openModalOnClick?: boolean;
  imageSize?: BoxProps['boxSize'];
  ctaButtonVariant?: 'primary' | 'mktPrimary';
}

const NftSaleCard = ({
  order,
  showDelistButton,
  isOwner,
  showBuyButton,
  openModalOnClick = true,
  withHandle,
  imageSize,
  ctaButtonVariant = 'primary',
}: NftSaleCardProps) => {
  const { successToast, errorToast } = useCustomToast();
  const { cancelOrderAsync, isPending: isCanceling } = useCancelOrder();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { updatedOrders } = useProcessingOrdersStore();

  const handleOpenDialog = () => {
    onOpen();
  };

  const handleCloseDialog = () => {
    onClose();
  };
  const delistModal = useDisclosure();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleCancelOrder = useCallback(async () => {
    try {
      await cancelOrderAsync(order.id);
      successToast({
        title: 'Delisted successfully',
        description: 'Your order has been successfully cancelled.',
      });
      handleCloseDialog();
    } catch {
      errorToast({
        title: 'Error delisting order',
        description: 'An error occurred while delisting your order.',
      });
    }
  }, [cancelOrderAsync, order.id, successToast, errorToast]);

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
      handleOpenDialog();
    }
  };

  const isProcessigNewPrices = useMemo(() => {
    const hasOrderUpdated = updatedOrders.find(
      (updatedOrder) => updatedOrder.orderId === order.id
    );
    return (
      hasOrderUpdated &&
      (order.price.amount !== hasOrderUpdated?.newAmount ||
        order.price.image !== hasOrderUpdated?.assetIcon)
    );
  }, [updatedOrders, order.id, order.price.amount, order.price.image]);

  return (
    <NftCard.Root onClick={handleCardClick} cursor="pointer" minH="240px">
      {/* {order.nft?.edition && (
        <NftCard.EditionBadge edition={order.nft?.edition} />
      )} */}
      {showDelistButton && <NftCard.DelistButton onDelist={handleDelist} />}
      <NftCard.Image boxSize={imageSize} src={imageUrl} />
      <NftCard.Content h={showBuyButton ? 'full' : '70px'}>
        <Text
          fontSize="xs"
          color="text.700"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          minH="13px"
          lineHeight=".9"
        >
          {name}
        </Text>
        <Skeleton
          isLoaded={!isProcessigNewPrices}
          rounded="md"
          minH="30px"
          gap="8px"
          display="flex"
          flexDir="column"
        >
          <Heading
            display="flex"
            alignItems="center"
            gap={1}
            fontSize="md"
            color="text.700"
            h="14px"
          >
            <Tooltip label={order.asset?.name}>
              <Image src={assetSymbolUrl} alt="Asset Icon" w={4} height={4} />
            </Tooltip>
            {order.price.amount}
          </Heading>
          {order.price.usd && (
            <Text color="grey.subtitle" fontSize="xs" lineHeight=".9">
              {currency}
            </Text>
          )}
        </Skeleton>

        {showBuyButton && (
          <Button height="auto" py={1.5} variant={ctaButtonVariant}>
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
          onClose={handleCloseDialog}
          onCancelOrder={handleCancelOrder}
          isCanceling={isCanceling}
          value={order.price.amount}
          usdValue={currency}
          isOwner={isOwner}
          withHandle={withHandle}
          ctaButtonVariant={ctaButtonVariant}
        />
      )}
    </NftCard.Root>
  );
};

export default NftSaleCard;
