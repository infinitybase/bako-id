import { useWallet } from '@fuels/react';
import { useRegistryContract } from './sdk';
import { useMutation } from '@tanstack/react-query';
import { useCustomToast } from '../components';
import { useState } from 'react';
import { getWalletSignatureErrorTitle } from '../utils/walletSignatureErrorsTitle';

const useSetPrimaryHandle = (domain: string, handleCloseDialog: () => void) => {
  const { errorToast, successToast } = useCustomToast();
  const { wallet } = useWallet();
  const registryContract = useRegistryContract();

  const [isSigning, setIsSigning] = useState(false);

  const { mutate: setPrimaryHandle, isPending } = useMutation({
    mutationKey: ['changePrimaryHandle', wallet?.address.toB256()],
    mutationFn: async () => {
      return await registryContract?.changePrimaryHandle(domain);
    },
    onSuccess: () => {
      successToast({
        title: 'Successfully set primary handle',
      });
      setIsSigning(false);
      handleCloseDialog();
    },
    onError: (error) => {
      console.error(error);
      const errorTitle = getWalletSignatureErrorTitle(
        error,
        'Failed to set primary handle'
      );
      errorToast({
        title: errorTitle,
        description:
          'There was an error updating your primary handle, please try again',
      });
      setIsSigning(false);
    },
  });

  const handleSetPrimaryHandle = async () => {
    setIsSigning(true);
    setPrimaryHandle();
  };

  return {
    isLoading: isSigning || isPending,
    handleSetPrimaryHandle,
  };
};

export { useSetPrimaryHandle };
