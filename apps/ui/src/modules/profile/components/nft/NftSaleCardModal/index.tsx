import UnknownAsset from '@/assets/unknown-asset.png';
import type { Order } from '@/types/marketplace';
import { useEffect, useState } from 'react';
import { NftModal } from '../modal';
import NftDetailsStep from './NftDetailsStep';
import NftFormStep from './NftFormStep';
import { useGetOrder } from '@/hooks/marketplace';
import { OrderSkeleton } from '@/modules/marketplace/order/components/orderSkeleton';
import { useParams } from '@tanstack/react-router';
import { Flex, Heading, Icon } from '@chakra-ui/react';
import { useScreenSize } from '@/hooks';
import { CloseIcon } from '@/components/icons/closeIcon';
import NftSuccessStep from './NftSuccessStep';

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
  isExecuted?: boolean;
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
  isExecuted,
}: NftSaleCardModalProps) => {
  const [step, setStep] = useState(0);

  const { orderId } = useParams({ strict: false });
  const { isMobile } = useScreenSize();

  const { order: orderData } = useGetOrder({
    id: orderId ?? order.id,
  });

  const handleChangeStepToSell = () => {
    setStep(1);
  };

  const handleChangeStepToDetails = () => {
    setStep(0);
  };

  const handleChangeStepToSuccess = () => {
    setStep(2);
  };

  const nftName = orderData?.asset?.name ?? 'Unknown NFT';
  const assetSymbolUrl = orderData?.price?.image || UnknownAsset;

  useEffect(() => {
    if (isExecuted) {
      setStep(2);
    }
  }, [isExecuted]);

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
        position="relative"
        py={isMobile ? 0 : 6}
        pb={6}
      >
        {isLoadingOrder && <OrderSkeleton />}

        {!isLoadingOrder && orderData && (
          <>
            {isMobile && (
              <Flex
                pt={4}
                alignItems="center"
                justifyContent="space-between"
                w="full"
                zIndex={1}
              >
                <Heading>{nftName}</Heading>
                <Icon as={CloseIcon} cursor="pointer" onClick={onClose} />
              </Flex>
            )}

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
                onSuccess={handleChangeStepToSuccess}
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

            {step === 2 && orderData && (
              <NftSuccessStep
                orderData={orderData}
                onClose={onClose}
                nftName={nftName}
                collectionName={orderData.collection.name}
              />
            )}
          </>
        )}
      </NftModal.Content>
    </NftModal.Root>
  );
};
