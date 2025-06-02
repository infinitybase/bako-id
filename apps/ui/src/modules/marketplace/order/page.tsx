import nftEmpty from '@/assets/nft-empty.png';
import { useCustomToast } from '@/components';
import { useResolverName } from '@/hooks';
import { useCancelOrder, useGetOrder } from '@/hooks/marketplace';
import { NftSaleCardModal } from '@/modules/profile/components/nft/NftSaleCardModal';
import { removeRightZeros } from '@/utils/removeRightZeros';
import { useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { Navigate, useNavigate, useParams } from '@tanstack/react-router';
import { ZeroBytes32, bn } from 'fuels';
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

  const { order, isLoading, isFetched } = useGetOrder({ id: orderId });

  const handleClose = useCallback(() => {
    navigate({
      to: '/marketplace',
    });
  }, [navigate]);

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

  const rate = useMemo(() => order?.asset?.rate ?? 0, [order?.asset?.rate]);

  const value = useMemo(
    () => bn(order?.itemPrice).formatUnits(order?.asset?.decimals),
    [order?.itemPrice, order?.asset?.decimals]
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

  const nftPrice = useMemo(() => removeRightZeros(value), [value]);

  const imageUrl = order?.nft?.image || nftEmpty;

  if (!order && isFetched) {
    return <Navigate to="/marketplace" replace />;
  }

  return (
    <NftSaleCardModal
      isOpen
      onClose={handleClose}
      order={order!}
      imageUrl={imageUrl}
      usdValue={currency}
      onCancelOrder={handleConfirmDelist}
      value={nftPrice}
      isOwner={order?.seller === currentAddress}
      withHandle={!!data}
      isCanceling={isCancelling}
      isLoadingOrder={isLoading || isResolvingName}
    />
  );
}
