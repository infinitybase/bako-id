import UnknownAsset from '@/assets/unknown-asset.png';
import type { Order } from '@/types/marketplace';
import { useState } from 'react';
import { NftModal } from '../modal';
import NftDetailsStep from './NftDetailsStep';
import NftFormStep from './NftFormStep';

interface NftSaleCardModalProps {
  order: Order;
  value: string;
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  usdValue: string;
  onCancelOrder: () => Promise<void>;
  isCanceling?: boolean;
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
  withHandle,
}: NftSaleCardModalProps) => {
  const [step, setStep] = useState(0);

  const handleChangeStepToSell = () => {
    setStep(1);
  };

  const handleChangeStepToDetails = () => {
    setStep(0);
  };

  const nftName = order.nft?.name ?? 'Unknown NFT';
  const assetSymbolUrl = order.asset?.icon || UnknownAsset;

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
        <NftModal.Image w="full" src={imageUrl} alt={nftName} />

        {step === 0 && (
          <NftDetailsStep
            order={order}
            isOwner={isOwner}
            onCancelOrder={onCancelOrder}
            isCanceling={isCanceling}
            onClose={onClose}
            usdValue={usdValue}
            userWithHandle={withHandle}
            value={value}
            onEdit={handleChangeStepToSell}
          />
        )}

        {step === 1 && (
          <NftFormStep
            assetSymbolUrl={assetSymbolUrl}
            order={order}
            value={value}
            onClose={onClose}
            name={nftName}
            onCancel={handleChangeStepToDetails}
            userWithHandle={withHandle}
          />
        )}

        <NftModal.CloseIcon onClose={onClose} />
      </NftModal.Content>
    </NftModal.Root>
  );
};
