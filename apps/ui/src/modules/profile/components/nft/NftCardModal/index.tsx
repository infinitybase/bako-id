import { useResolverName } from '@/hooks';
import type { Asset } from '@/types/marketplace';
import { parseURI } from '@/utils/formatter';
import { useWallet } from '@fuels/react';
import { ZeroBytes32 } from 'fuels';
import { useCallback, useState } from 'react';
import { NftModal } from '../modal';
import NftDetailStep from './NftDetailsStep';
import NftFormStep from './NftFormStep';

interface NftCardModalProps {
  assetId: string;
  contractId?: string;
  nftName: React.ReactNode;
  metadata?: Record<string, string>;
  image: string;
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  isOwner: boolean;
  collection?: string;
  ctaButtonVariant?: 'primary' | 'mktPrimary';
}

export const NftCardModal = ({
  assetId,
  nftName,
  contractId,
  metadata,
  image,
  isOpen,
  onClose,
  assets,
  isOwner,
  collection,
  ctaButtonVariant = 'primary',
}: NftCardModalProps) => {
  const [step, setStep] = useState(0);
  const { wallet } = useWallet();
  const { data } = useResolverName(wallet?.address.b256Address || ZeroBytes32);

  const handleChangeStepToSell = useCallback(() => {
    setStep(1);
  }, []);

  const handleChangeStepToDetails = useCallback(() => {
    setStep(0);
  }, []);

  return (
    <NftModal.Root onClose={onClose} isOpen={isOpen}>
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
        <NftModal.Image w="full" src={parseURI(image)} alt="NFT image" />
        {step === 0 && (
          <NftDetailStep
            isOwner={isOwner}
            nftName={nftName}
            contractId={contractId}
            assetId={assetId}
            metadata={metadata}
            collection={collection}
            onSellClick={handleChangeStepToSell}
            ctaButtonVariant={ctaButtonVariant}
          />
        )}

        {step === 1 && (
          <NftFormStep
            assetId={assetId}
            name={nftName}
            onCancel={handleChangeStepToDetails}
            onClose={onClose}
            userWithHandle={!!data}
            assets={assets}
          />
        )}

        <NftModal.CloseIcon onClose={onClose} />
      </NftModal.Content>
    </NftModal.Root>
  );
};
