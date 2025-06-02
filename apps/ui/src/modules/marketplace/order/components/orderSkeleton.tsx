import { NftModal } from '@/modules/profile/components/nft/modal';
import { Skeleton } from '@chakra-ui/react';

export const OrderSkeleton = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <NftModal.Root isOpen onClose={handleClose}>
      <NftModal.Content h="540px">
        <NftModal.Image w="full" src="" alt="Loading..." />
        <Skeleton height="full" />
      </NftModal.Content>
    </NftModal.Root>
  );
};
