import { useDisclosure } from '@chakra-ui/react';
/* eslint-disable react-hooks/exhaustive-deps */
import { useSignIn, type StatusAPIResponse } from '@farcaster/auth-kit';
import { useEffect, useState } from 'react';
import { useCustomToast } from '../components';

export const useFarcaster = () => {
  const { errorToast } = useCustomToast();
  const {
    data,
    url,
    isError,
    reconnect,
    signIn,
    signOut,
    connect,
    appClient,
    channelToken,
    isConnected,
  } = useSignIn({
    nonce: 'abcd1234',
    requestId: 'some-unique-request-id',
    timeout: 20000,
    interval: 1,
    onError: (error) => {
      console.log('Error', error);
    },
    onSuccess: (data) => {
      console.log('Success', data);
    },
    onStatusResponse: (status) => {
      console.log(status);
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [farcasterUser, setFarcasterUser] = useState<StatusAPIResponse>();

  const tryConnection = async () => {
    if (!channelToken) {
      return;
    }
    connect();

    try {
      const response = await appClient?.watchStatus({
        timeout: 20000,
        channelToken: channelToken,
      });

      if (response?.data.state === 'completed' && response.data.username) {
        return response.data;
      }
    } catch (error) {
      errorToast({
        title: 'Error',
        description: 'An error occurred while trying to connect.',
      });

      console.error(error);
    }
  };

  const handleVerify = async () => {
    const data = await tryConnection();

    if (data) {
      setFarcasterUser(data);
      onClose();
    }

    if (isError) {
      reconnect();
    }
    //TODO: Set contract verification
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    tryConnection();
  }, [handleVerify]);

  return {
    data,
    url,
    signIn,
    signOut,
    connect,
    reconnect,
    handleVerify,
    isError,
    isConnected,
    channelToken,
    appClient,
    farcasterUser,
    dialog: {
      isOpen,
      onOpen,
      onClose,
    },
  };
};
