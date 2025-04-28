/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import nftEmpty from '@/assets/nft-empty.png';
import UnknownAsset from '@/assets/unknown-asset.png';
import { ConfirmationDialog, useCustomToast } from '@/components';
import { useCancelOrder } from '@/hooks/marketplace';
import type { FuelAsset } from '@/services/fuel-assets';
import type { Nft } from '@/types/marketplace';
import { Button, Heading, Image, Text, useDisclosure } from '@chakra-ui/react';
import { type MouseEvent, useCallback, useMemo } from 'react';
import { NftCard } from './card';
import { NftSaleCardModal } from './NftSaleCardModal';

interface NftSaleCardProps {
  orderId: string;
  asset: (FuelAsset & { id: string }) | null;
  value: string;
  nft: Nft;
  showDelistButton: boolean;
  isOwner: boolean;
}

const NftSaleCard = ({
  value,
  orderId,
  nft,
  showDelistButton,
  isOwner,
  asset,
}: NftSaleCardProps) => {
  const { successToast, errorToast } = useCustomToast();
  const { cancelOrderAsync, isPending: isCanceling } = useCancelOrder();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const delistModal = useDisclosure();

  const handleCancelOrder = useCallback(async () => {
    try {
      await cancelOrderAsync(orderId);
      successToast({
        title: 'Order cancelled',
        description: 'Your order has been successfully cancelled.',
      });
      onClose();
    } catch (error) {
      console.log(error);
      errorToast({
        title: 'Error cancelling order',
        description: 'An error occurred while cancelling your order.',
      });
    }
  }, [cancelOrderAsync, orderId, successToast, errorToast, onClose]);

  const handleDelist = (e: MouseEvent) => {
    e.stopPropagation();
    delistModal.onOpen();
  };

  const handleConfirmDelist = async () => {
    await handleCancelOrder();
    delistModal.onClose();
  };

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

  const assetSymbolUrl = asset?.icon ?? UnknownAsset;

  const imageUrl = nft.image ?? nftEmpty;
  const name = nft.name ?? 'Unknown NFT';

  return (
    <NftCard.Root onClick={onOpen} cursor="pointer" minH="240px">
      {nft.edition && <NftCard.EditionBadge edition={nft.edition} />}
      {showDelistButton && <NftCard.DelistButton onDelist={handleDelist} />}
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

        {!isOwner && <Button variant="primary">Buy</Button>}
      </NftCard.Content>

      {delistModal.isOpen && (
        <ConfirmationDialog
          title="Delist NFT"
          isOpen
          onClose={delistModal.onClose}
          onConfirm={handleConfirmDelist}
          isConfirming={isCanceling}
        >
          <Text fontSize="sm" color="text.700">
            Are you sure you want to delist this NFT? This action cannot be
            undone.
          </Text>
        </ConfirmationDialog>
      )}

      {isOpen && (
        <NftSaleCardModal
          orderId={orderId}
          imageUrl={imageUrl}
          isOpen={isOpen}
          onClose={onClose}
          nft={nft}
          name={name}
          onCancelOrder={handleCancelOrder}
          isCanceling={isCanceling}
          value={valueWithoutRigthZeros}
          asset={{
            iconUrl: assetSymbolUrl,
            decimals: asset?.decimals,
            id: asset?.id!,
            name: asset?.name ?? 'Unknown',
          }}
          usdValue={currency}
          isOwner={isOwner}
        />
      )}
    </NftCard.Root>
  );
};

export default NftSaleCard;
