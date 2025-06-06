/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import nftEmpty from '@/assets/nft-empty.png';
import UnknownAsset from '@/assets/unknown-asset.png';
import { ConfirmationDialog, useCustomToast } from '@/components';
import { useCancelOrder } from '@/hooks/marketplace';
import type { Order } from '@/types/marketplace';
import { Button, Heading, Image, Text, useDisclosure } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useCallback, useMemo, type MouseEvent } from 'react';
import { NftSaleCardModal } from './NftSaleCardModal';
import { NftCard } from './card';

interface NftSaleCardProps {
  order: Order;
  showDelistButton: boolean;
  isOwner: boolean;
  showBuyButton: boolean;
  withHandle: boolean;
}

const NftSaleCard = ({
  order,
  showDelistButton,
  isOwner,
  showBuyButton,
  withHandle,
}: NftSaleCardProps) => {
  const { successToast, errorToast } = useCustomToast();
  const { cancelOrderAsync, isPending: isCanceling } = useCancelOrder();
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const rate = useMemo(() => order.asset?.rate ?? 0, [order.asset?.rate]);

  const value = useMemo(
    () => bn(order.itemPrice).formatUnits(order.asset?.decimals),
    [order.itemPrice, order.asset?.decimals]
  );

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

  const removeRightZeros = useCallback((num: string) => {
    const parts = num.split('.');
    if (parts.length === 2) {
      parts[1] = parts[1].replace(/0+$/, '');
      if (parts[1] === '') {
        return parts[0]; // Return only the integer part if decimal part is empty
      }
      return parts.join('.');
    }
    return num; // Return the original number if no decimal part
  }, []);

  const nftPrice = useMemo(
    () => removeRightZeros(value),
    [value, removeRightZeros]
  );

  const assetSymbolUrl = order.asset?.icon || UnknownAsset;

  const imageUrl = order.nft?.image || nftEmpty;
  const name = order.nft?.name || 'Unknown NFT';

  return (
    <NftCard.Root onClick={onOpen} cursor="pointer" minH="240px">
      {order.nft?.edition && (
        <NftCard.EditionBadge edition={order.nft?.edition} />
      )}
      {showDelistButton && <NftCard.DelistButton onDelist={handleDelist} />}
      <NftCard.Image src={imageUrl} />
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
          <Image src={assetSymbolUrl} alt="Asset Icon" w={4} height={4} />
          {nftPrice}
        </Heading>
        {order.asset?.rate && (
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
          value={nftPrice}
          usdValue={currency}
          isOwner={isOwner}
          withHandle={withHandle}
        />
      )}
    </NftCard.Root>
  );
};

export default NftSaleCard;
