import { RegistryContract } from '@bako-id/sdk';
import { useDisclosure } from '@chakra-ui/react';
import { useProvider, useWallet } from '@fuels/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Provider } from 'fuels';
import { useCustomToast } from '../components';
import { useState } from 'react';
import type { MetadataKeys } from '../utils/metadataKeys';

export enum MetadataQueryKey {
  HANDLE_LIST = 'handleList',
  HANDLE_SAVE = 'handleSave',
}

export interface MetadataKeyValue {
  key: MetadataKeys;
  value: string;
}

export const useMetadata = () => {
  const [updatedMetadata, setUpdatedMetadata] = useState<MetadataKeyValue[]>(
    [],
  );
  const { domain } = useParams({ strict: false });
  const { provider } = useProvider();
  const { wallet } = useWallet();
  const metadataModal = useDisclosure();
  const transactionModal = useDisclosure();
  const { successToast, errorToast } = useCustomToast();

  const handleListRequest = useQuery({
    queryKey: [MetadataQueryKey.HANDLE_LIST, domain],
    queryFn: async () => {
      // TODO: Limit to owners only?
      try {
        let registryContract: RegistryContract;

        if (provider) {
          registryContract = RegistryContract.create(provider);
        } else {
          const provider = await Provider.create(
            import.meta.env.VITE_PROVIDER_URL,
          );
          registryContract = RegistryContract.create(provider);
        }

        const metadata = await registryContract.getMetadata(domain);

        return Object.entries(metadata).map(([key, value]) => ({
          key,
          value,
        }));
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    enabled: !!domain,
  });

  const handleSaveRequest = useMutation({
    mutationKey: [MetadataQueryKey.HANDLE_SAVE],
    mutationFn: async () => {
      if (!wallet) return;

      const metadataPayload = {
        ...updatedMetadata.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {},
        ),
      };

      const setContract = RegistryContract.create(wallet);
      await setContract
        .setMetadata(domain, metadataPayload)
        .catch((e) => console.log(e));
    },
    onSuccess: () => {
      successToast({
        title: 'Profile Updated',
        description: 'You have successfully updated your profile',
      });

      setUpdatedMetadata([]);

      handleListRequest.refetch();
      transactionModal.onClose();
    },
    onError: (error) => {
      console.error(error.message);
      errorToast({
        title: 'Profile Update Failed',
        description:
          'There was an error updating your profile, please try again',
      });
    },
  });

  return {
    metadata: handleListRequest.data,
    metadataModal,
    transactionModal,
    handleSaveRequest,
    updatedMetadata,
    setUpdatedMetadata,
  };
};
