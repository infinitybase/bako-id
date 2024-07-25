import { UserMetadataContract, type Metadata } from '@bako-id/sdk';
/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from '@tanstack/react-router';
import { useFuelConnect } from '../../../hooks';
import { useSetPrimaryHandleRequest } from '../../../hooks/useSetPrimaryHandleRequests';

export const useEditProfile = async () => {
  const { domain } = useParams({ strict: false });
  const { wallet: account } = useFuelConnect();
  const primaryHandle = await useSetPrimaryHandleRequest();

  const handleSetPrimaryHandle = (handle?: string) => {
    if (!account || !handle) return;
    primaryHandle.mutate(
      { domain, account },
      {
        onSuccess: () => {
          console.log('Primary handle set');
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  const handleBatchSaveMetadata = async (metadata: Metadata[]) => {
    if (!account) return;
    try {
      const userMetadata = UserMetadataContract.initialize(account, domain);
      await userMetadata.batchSaveMetadata(metadata);
    } catch (error) {
      console.log(error);
    }
  };

  return { handleSetPrimaryHandle, handleBatchSaveMetadata };
};
