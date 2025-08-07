import UnknownAsset from '@/assets/unknown-asset.png';
import type { Order } from '@/types/marketplace';
import { useState } from 'react';
import { NftModal } from '../modal';
import NftDetailsStep from './NftDetailsStep';
import NftFormStep from './NftFormStep';
import { useGetOrder } from '@/hooks/marketplace';
import { OrderSkeleton } from '@/modules/marketplace/order/components/orderSkeleton';
import { useParams } from '@tanstack/react-router';

interface NftSaleCardModalProps {
  order: Order;
  value: number;
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  usdValue: string;
  onCancelOrder: () => Promise<void>;
  isCanceling?: boolean;
  isLoadingOrder?: boolean;
  isOwner: boolean;
  withHandle: boolean;
  ctaButtonVariant?: 'primary' | 'mktPrimary';
}

export const NftSaleCardModal = ({
  isOpen,
  onClose,
  onCancelOrder,
  isCanceling = false,
  usdValue,
  imageUrl,
  isOwner,
  value,
  isLoadingOrder = false,
  withHandle,
  order,
  ctaButtonVariant = 'primary',
}: NftSaleCardModalProps) => {
  const [step, setStep] = useState(0);

  const { orderId } = useParams({ strict: false });

  const { order: orderData } = useGetOrder({
    id: orderId ?? order.id,
  });

  const handleChangeStepToSell = () => {
    setStep(1);
  };

  const handleChangeStepToDetails = () => {
    setStep(0);
  };

  const nftName = orderData?.asset?.name ?? 'Unknown NFT';
  const assetSymbolUrl = orderData?.price?.image || UnknownAsset;

  return (
    <NftModal.Root isOpen={isOpen} onClose={onClose}>
      <NftModal.Content
        flexDirection={{
          base: 'column',
          md: 'row',
        }}
        maxH="540px"
        overflowY={{
          base: 'scroll',
          md: 'hidden',
        }}
      >
        {isLoadingOrder && <OrderSkeleton />}

        {!isLoadingOrder && orderData && (
          <>
            <NftModal.Image w="full" src={imageUrl} alt={nftName} />

            {step === 0 && orderData && (
              <NftDetailsStep
                order={orderData}
                isOwner={isOwner}
                onCancelOrder={onCancelOrder}
                isCanceling={isCanceling}
                onClose={onClose}
                usdValue={usdValue}
                value={value}
                onEdit={handleChangeStepToSell}
                ctaButtonVariant={ctaButtonVariant}
              />
            )}

            {step === 1 && orderData && (
              <NftFormStep
                assetSymbolUrl={assetSymbolUrl}
                order={orderData}
                value={value}
                onClose={onClose}
                name={nftName}
                onCancel={handleChangeStepToDetails}
                userWithHandle={withHandle}
                ctaButtonVariant={ctaButtonVariant}
              />
            )}
          </>
        )}

        {step !== 0 && <NftModal.CloseIcon onClose={onClose} />}
      </NftModal.Content>
    </NftModal.Root>
  );
};
