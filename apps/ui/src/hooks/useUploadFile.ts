import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getContractId } from '@bako-id/sdk';
import { useProvider, useWallet } from '@fuels/react';
import { useState } from 'react';
import { useCustomToast } from '../components';
import { sha256 } from 'fuels';
import { Manager, Nft, UploaderValidatorScript } from '@bako-id/contracts';
import { Networks, resolveNetwork } from '../utils/resolverNetwork';

const { VITE_API_URL } = import.meta.env;

const useUpdateFile = (domain: string, onClose: () => void) => {
  const queryClient = useQueryClient();

  const [isSigning, setIsSigning] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
  const [uploadedFileHash, setUploadedFileHash] = useState<string | undefined>(
    undefined
  );

  const { provider } = useProvider();
  const [signProgress, setSignProgress] = useState(0);
  const { successToast, errorToast } = useCustomToast();
  const { wallet } = useWallet();

  const handleClose = () => {
    if (isSigning) {
      setIsSigning(false);
    }
    setUploadedFile(undefined);
    setSignProgress(0);
    onClose();
  };

  const { mutate: saveOnServer } = useMutation<
    void,
    Error,
    { file: File; transactionId: string }
  >({
    mutationKey: ['saveFile', domain],
    mutationFn: async ({ file, transactionId }) => {
      const formData = new FormData();

      const data = {
        file,
        transactionId,
        uploadedFileHash: uploadedFileHash ?? '',
        unverifiedAddress: wallet?.address.toB256() ?? '',
      };

      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }

      const response = await fetch(
        `${VITE_API_URL}/${resolveNetwork(provider?.getChainId() ?? Networks.TESTNET)}/upload?handle=${domain}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error while uploading the avatar: ${errorData.error}`);
      }
    },
    onSuccess: () => {
      setSignProgress(100);
      successToast({
        title: 'Success!',
        description: 'Your avatar was successfully updated.',
      });
      setIsSigning(false);
      setUploadedFile(undefined);
      queryClient.invalidateQueries({
        queryKey: ['getHandleAvatar'],
      });
      handleClose();
    },
    onError: (error) => {
      setSignProgress(0);
      console.error(error.message);

      errorToast({
        title: 'Something went wrong while saving your avatar',
        description:
          'There was an error updating your avatar, please try again',
      });
      setIsSigning(false);
      setUploadedFile(undefined);
      handleClose();
    },
  });

  const { mutate: registry } = useMutation({
    mutationKey: ['uploadFileTransaction', domain],
    mutationFn: async (file: File) => {
      const managerId = getContractId(provider!.url, 'manager');
      const registryId = getContractId(provider!.url, 'registry');
      const nftId = getContractId(provider?.url ?? '', 'nft');
      const nft = new Nft(nftId, wallet!);
      const manager = new Manager(managerId, wallet!);

      const script = new UploaderValidatorScript(wallet!);
      script.setConfigurableConstants({
        MANAGER_ADDRESS: managerId,
        REGISTRY_ADDRESS: registryId,
      });

      setUploadedFile(file);
      setSignProgress(33);

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const fileHash = sha256(uint8Array);

      setUploadedFileHash(fileHash);

      const network = resolveNetwork(
        provider?.getChainId() ?? Networks.TESTNET
      );

      const baseUrl = `${VITE_API_URL}/${network}/avatar/`;

      const { transactionId, waitForResult } = await script.functions
        .main(fileHash, domain, baseUrl)
        .addContracts([manager, nft])
        .call();

      await waitForResult();

      return {
        transactionId,
      };
    },
    onSuccess: ({ transactionId }) => {
      setSignProgress(66);
      saveOnServer({
        file: uploadedFile!,
        transactionId,
      });
    },
    onError: (error) => {
      setSignProgress(0);
      console.error(error.message);

      const errorTitle =
        error.message?.includes('rejected') ||
        error.message?.includes('disconnected') ||
        error.message?.includes('cancelled')
          ? 'Signature Failed'
          : 'Profile Update Failed';

      errorToast({
        title: errorTitle,
        description:
          'There was an error updating your avatar, please try again',
      });
      setIsSigning(false);
    },
  });

  const handleSignAvatarTransaction = async () => {
    setIsSigning(true);
    registry(uploadedFile!);
  };

  return {
    isSigning,
    registry,
    setIsSigning,
    saveOnServer,
    signProgress,
    uploadedFile,
    setUploadedFile,
    handleSignAvatarTransaction,
    handleClose,
  };
};

export { useUpdateFile };
