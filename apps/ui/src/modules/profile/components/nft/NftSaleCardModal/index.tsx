import UnknownAsset from '@/assets/unknown-asset.png';
import { OrderSkeleton } from '@/modules/marketplace/order/components/orderSkeleton';
import type { Orders } from '@/types/marketplace';
import { useState } from 'react';
import { NftModal } from '../modal';
import { useGetOrder } from '@/hooks/marketplace/useGetOrder';
import NftDetailsStep from './NftDetailsStep';
import NftFormStep from './NftFormStep';

interface NftSaleCardModalProps {
  order: Orders;
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
}

export const NftSaleCardModal = ({
  order,
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
}: NftSaleCardModalProps) => {
  const [step, setStep] = useState(0);

  const { order: orderData } = useGetOrder({ orderId: order.id });

  const handleChangeStepToSell = () => {
    setStep(1);
  };

  const handleChangeStepToDetails = () => {
    setStep(0);
  };

  const nftName = orderData?.data?.asset?.name ?? 'Unknown NFT';
  const assetSymbolUrl = orderData?.data?.price?.image || UnknownAsset;

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
        {!isLoadingOrder && orderData?.data && (
          <>
            <NftModal.Image w="full" src={imageUrl} alt={nftName} />

            {step === 0 && (
              <NftDetailsStep
                order={orderData?.data}
                isOwner={isOwner}
                onCancelOrder={onCancelOrder}
                isCanceling={isCanceling}
                onClose={onClose}
                usdValue={usdValue}
                value={value}
                onEdit={handleChangeStepToSell}
              />
            )}

            {step === 1 && (
              <NftFormStep
                assetSymbolUrl={assetSymbolUrl}
                order={orderData?.data}
                value={value}
                onClose={onClose}
                name={nftName}
                onCancel={handleChangeStepToDetails}
                userWithHandle={withHandle}
              />
            )}
          </>
        )}
        <NftModal.CloseIcon onClose={onClose} />
      </NftModal.Content>
    </NftModal.Root>
  );
};
