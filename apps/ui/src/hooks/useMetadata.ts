import { type MetadataKeys, RegistryContract } from '@bako-id/sdk';
import { useDisclosure } from '@chakra-ui/react';
import { useProvider, useWallet } from '@fuels/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Provider } from 'fuels';
import { useState } from 'react';
import { useCustomToast } from '../components';
import { getWalletSignatureErrorTitle } from '../utils/walletSignatureErrorsTitle';

const { VITE_PROVIDER_URL } = import.meta.env;

export enum MetadataQueryKey {
  HANDLE_LIST = 'handleList',
  HANDLE_SAVE = 'handleSave',
}

export type MetadataKeyValue = {
  key: MetadataKeys;
  value: string;
};

export type MetadataResponse =
  | { key: string; value: string | undefined }[]
  | undefined;

export const useMetadata = (
  handleOnSuccess?: () => void,
  handleName?: string
) => {
  const [updatedMetadata, setUpdatedMetadata] = useState<MetadataKeyValue[]>(
    []
  );
  const { domain } = useParams({ strict: false });
  const { provider } = useProvider();
  const { wallet } = useWallet();
  const metadataModal = useDisclosure();
  const transactionModal = useDisclosure();
  const { successToast, errorToast } = useCustomToast();

  const handleListRequest = useQuery({
    queryKey: [
      MetadataQueryKey.HANDLE_LIST,
      provider?.url ?? VITE_PROVIDER_URL,
      handleName ?? domain,
    ],
    queryFn: async () => {
      try {
        let registryContract: RegistryContract;

        if (provider) {
          registryContract = RegistryContract.create(provider);
        } else {
          const provider = new Provider(import.meta.env.VITE_PROVIDER_URL);
          registryContract = RegistryContract.create(provider);
        }

        const metadata = await registryContract.getMetadata(
          handleName ?? domain
        );

        return Object.entries(metadata).map(([key, value]) => ({
          key,
          value,
        }));
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    enabled: !!domain || !!handleName,
    refetchOnWindowFocus: false,
  });

  const handleSaveRequest = useMutation({
    mutationKey: [MetadataQueryKey.HANDLE_SAVE],
    mutationFn: async () => {
      if (!wallet) return;

      const metadataPayload = {
        ...updatedMetadata.reduce(
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {}
        ),
      };

      const setContract = RegistryContract.create(wallet);

      return await setContract.setMetadata(domain, metadataPayload);
    },
    onSuccess: () => {
      successToast({
        title: 'Profile Updated',
        description: 'You have successfully updated your profile',
      });

      setUpdatedMetadata([]);
      handleOnSuccess?.();

      handleListRequest.refetch();
      transactionModal.onClose();
    },
    onError: (error) => {
      console.error(error.message);

      const errorTitle = getWalletSignatureErrorTitle(
        error,
        'Profile Update Failed'
      );

      errorToast({
        title: errorTitle,
        description:
          'There was an error updating your profile, please try again',
      });
    },
  });

  return {
    metadata: handleListRequest.data,
    loadingMetadata: handleListRequest.isLoading,
    fetchingMetadata: handleListRequest.isFetching,
    metadataModal,
    transactionModal,
    handleSaveRequest,
    updatedMetadata,
    setUpdatedMetadata,
  };
};
