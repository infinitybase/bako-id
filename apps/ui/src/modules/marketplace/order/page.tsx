import nftEmpty from '@/assets/nft-empty.png';
import { useCustomToast } from '@/components';
import { useResolverName } from '@/hooks';
import { useCancelOrder, useGetOrder } from '@/hooks/marketplace';
import { NftSaleCardModal } from '@/modules/profile/components/nft/NftSaleCardModal';
import { parseURI } from '@/utils/formatter';
import { useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { Navigate, useNavigate, useParams } from '@tanstack/react-router';
import { ZeroBytes32 } from 'fuels';
import { useCallback, useMemo } from 'react';

export default function OrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ strict: false });
  const delistModal = useDisclosure();
  const { wallet } = useWallet();
  const { successToast, errorToast } = useCustomToast();
  const { cancelOrderAsync, isPending: isCancelling } = useCancelOrder();
  const { data, isLoading: isResolvingName } = useResolverName(
    wallet?.address.b256Address || ZeroBytes32
  );

  const { collectionId } = useParams({ strict: false });

  const { order, isLoading, isFetched } = useGetOrder({ id: orderId });

  const redirectUrl = `/marketplace/collection/${collectionId}`;

  const handleClose = useCallback(() => {
    navigate({
      to: redirectUrl,
    });
  }, [navigate, redirectUrl]);

  const currentAddress = useMemo(
    () => wallet?.address.b256Address,
    [wallet?.address.b256Address]
  );

  const handleCancelOrder = useCallback(async () => {
    try {
      await cancelOrderAsync(orderId);
      successToast({
        title: 'Order cancelled',
        description: 'Your order has been successfully cancelled.',
      });
      handleClose();
    } catch {
      errorToast({
        title: 'Error cancelling order',
        description: 'An error occurred while cancelling your order.',
      });
    }
  }, [cancelOrderAsync, orderId, successToast, errorToast, handleClose]);

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
      }).format(Number(order?.price.usd ?? 0)),
    [order?.price.usd]
  );

  const imageUrl = parseURI(order?.asset?.image ?? '') || nftEmpty;

  if (!order && isFetched) {
    return <Navigate to={redirectUrl} replace />;
  }

  return (
    <NftSaleCardModal
      isOpen
      onClose={handleClose}
      order={order!}
      imageUrl={imageUrl}
      usdValue={currency}
      onCancelOrder={handleConfirmDelist}
      value={order?.price.amount ?? 0}
      isOwner={order?.seller === currentAddress}
      withHandle={!!data}
      isCanceling={isCancelling}
      isLoadingOrder={isLoading || isResolvingName || !isFetched}
    />
  );
}
