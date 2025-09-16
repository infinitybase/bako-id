/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import nftEmpty from '@/assets/nft-empty.png';
import UnknownAsset from '@/assets/unknown-asset.png';
import { ConfirmationDialog, useCustomToast } from '@/components';
import {
  useCancelOrder,
  useExecuteOrder,
  useGetTransactionCost,
} from '@/hooks/marketplace';
import type { Order } from '@/types/marketplace';
import { orderPriceFormatter, parseURI } from '@/utils/formatter';
import {
  type BoxProps,
  Flex,
  Heading,
  Image,
  Skeleton,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { type MouseEvent, useCallback, useMemo, useState } from 'react';
import { NftSaleCardModal } from './NftSaleCardModal';
import { NftCard } from './card';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';
import { Link, useParams } from '@tanstack/react-router';
import { useAccount, useBalance, useConnectUI } from '@fuels/react';
import { bn } from 'fuels';
import { useScreenSize } from '@/hooks';
import { slugify } from '@/utils/slugify';
import { useGetCollection } from '@/hooks/marketplace/useGetCollection';
import { AnimatedCardButton } from './AnimatedCardButton';
import { MarketplaceAction } from '@bako-id/marketplace';

interface NftSaleCardProps {
  order: Order;
  isOwner: boolean;
  showAnimatedButton: boolean;
  withHandle: boolean;
  openModalOnClick?: boolean;
  imageSize?: BoxProps['boxSize'];
  ctaButtonVariant?: 'primary' | 'mktPrimary';
  isProfilePage?: boolean;
}

const NftSaleCard = ({
  order,
  isOwner,
  showAnimatedButton,
  openModalOnClick = true,
  withHandle,
  imageSize,
  ctaButtonVariant = 'primary',
  isProfilePage,
}: NftSaleCardProps) => {
  const { isMobile } = useScreenSize();
  const { successToast, errorToast } = useCustomToast();
  const { cancelOrderAsync, isPending: isCanceling } = useCancelOrder();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { updatedOrders, addPurchasedOrder } = useProcessingOrdersStore();
  const { account } = useAccount();
  const { collectionName } = useParams({ strict: false });
  const { connect, isConnected } = useConnectUI();
  const [displayBuyButton, setDisplayBuyButton] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const slugifiedCollectionName = slugify(collectionName);

  const { data: transactionCost, isLoading: isLoadingTransactionCost } =
    useGetTransactionCost(order.id, MarketplaceAction.EXECUTE_ORDER);

  const { collection } = useGetCollection({
    collectionId: slugifiedCollectionName,
  });

  const { executeOrderAsync, isPending: isExecuting } = useExecuteOrder(
    collection?.data?.id ?? '',
    setTxId
  );

  const showDisplayBuyButton = displayBuyButton || isExecuting;

  const { balance: walletAssetBalance, isLoading: isLoadingWalletBalance } =
    useBalance({
      address: account,
      assetId: order.price.assetId,
    });

  const notEnoughBalance = useMemo(() => {
    if (isLoadingWalletBalance || !walletAssetBalance) return true;

    return walletAssetBalance.lt(bn(order.price.raw));
  }, [walletAssetBalance, isLoadingWalletBalance, order.price.raw]);

  const handleExecuteOrder = useCallback(
    async (e: MouseEvent) => {
      e.stopPropagation();
      if (!isConnected) {
        connect();
        return;
      }
      try {
        await executeOrderAsync(order.id);
        successToast({ title: 'Order executed successfully!' });
      } catch (e) {
        console.log('error executing order', e);
        errorToast({ title: 'Failed to execute order' });
      }
    },
    [
      connect,
      executeOrderAsync,
      order.id,
      successToast,
      errorToast,
      isConnected,
    ]
  );

  const handleOpenDialog = () => {
    onOpen();
    if (txId) {
      setTxId(null);
    }
  };

  const handleCloseDialog = () => {
    onClose();
    if (txId && order.id) {
      addPurchasedOrder(order.id, txId);
    }
    setTxId(null);
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
  const orderPrice = useMemo(
    () => orderPriceFormatter(Number(order.price.amount)),
    [order.price.amount]
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
    <NftCard.Root
      onClick={handleCardClick}
      cursor="pointer"
      minH="240px"
      onMouseEnter={() =>
        isMobile ? null : setDisplayBuyButton(!isProfilePage)
      }
      onMouseLeave={() => setDisplayBuyButton(false)}
      position="relative"
    >
      <Flex
        as={Link}
        to={
          isProfilePage
            ? undefined
            : `/collection/${slugifiedCollectionName}/order/${order.id}`
        }
        flexDir="column"
      >
        <NftCard.Image boxSize={imageSize} src={imageUrl} />
        <NftCard.Content h={showAnimatedButton ? 'full' : '70px'}>
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
              {orderPrice}
            </Heading>
            {order.price.usd && !displayBuyButton && (
              <Text color="grey.subtitle" fontSize="xs" lineHeight=".9">
                {currency}
              </Text>
            )}
          </Skeleton>
        </NftCard.Content>
      </Flex>
      {showAnimatedButton && (
        <AnimatedCardButton
          showDisplayBuyButton={showDisplayBuyButton}
          displayBuyButton={displayBuyButton}
          notEnoughBalance={notEnoughBalance}
          isConnected={isConnected}
          ctaButtonVariant={ctaButtonVariant}
          isMobile={isMobile}
          isLoading={isExecuting}
          isLoaded={!isLoadingWalletBalance}
          buttonAction={isOwner ? handleDelist : handleExecuteOrder}
          isOwner={isOwner}
        />
      )}
      {delistModal.isOpen && (
        <ConfirmationDialog
          title="Delist NFT"
          isOpen
          onClose={delistModal.onClose}
          onConfirm={handleConfirmDelist}
          isConfirming={isCanceling}
          confirmActionVariant="mktPrimary"
          confirmActionLabel="Yes, delist NFT"
          isGarage
        >
          <Text fontSize="sm" color="grey.subtitle">
            Are you sure you want to delist this NFT?
          </Text>
        </ConfirmationDialog>
      )}
      {(isOpen || txId) && (
        <NftSaleCardModal
          order={order}
          imageUrl={imageUrl}
          isOpen={isOpen || !!txId}
          onClose={handleCloseDialog}
          onCancelOrder={handleCancelOrder}
          isCanceling={isCanceling}
          value={order.price.amount}
          usdValue={currency}
          isOwner={isOwner}
          withHandle={withHandle}
          ctaButtonVariant={ctaButtonVariant}
          isExecuted={!!txId}
        />
      )}
    </NftCard.Root>
  );
};

export default NftSaleCard;
