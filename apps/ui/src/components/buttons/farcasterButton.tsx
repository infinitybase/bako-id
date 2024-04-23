import { isValidDomain, resolver } from '@bako-id/sdk';
import { Button, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { useSignIn } from '@farcaster/auth-kit';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo } from 'react';
import { FarcasterIcon, useCustomToast } from '..';
import { QRCodeDialog } from '../../modules/home/components/dialog';

interface IFarcasterButton {
  isBuy?: boolean;
}

export const FarcasterButton = ({ isBuy }: IFarcasterButton) => {
  const navigate = useNavigate();
  const { errorToast } = useCustomToast();
  const { url, isError, reconnect, signIn, connect, appClient, channelToken } =
    useSignIn({
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

  const handleFarcasterSignIn = useCallback(() => {
    if (!channelToken) {
      connect();
    }

    if (isError) {
      reconnect();
    }

    url && onOpen();
    signIn();
  }, [isError, onOpen, reconnect, channelToken, connect, signIn, url]);

  useEffect(() => {
    async function fetchData() {
      if (!channelToken) {
        return;
      }

      connect();

      try {
        const response = await appClient?.watchStatus({
          timeout: 20000,
          channelToken: channelToken,
        });

        if (
          response?.data.state === 'completed' &&
          isBuy &&
          response.data.username
        ) {
          const isValid = isValidDomain(response.data.username);
          if (!isValid) {
            errorToast({
              title: 'Invalid username',
              description: 'Please try another username',
            });
            return;
          }

          const info = await resolver(response.data.username);
          if (info) {
            errorToast({
              title: 'A domain with this username already exists',
              description: 'Please try another username',
            });
            return;
          }

          navigate({
            from: window.location.pathname,
            to: `/buy/${response.data.username}`,
          });
          onClose();
        }

        if (response?.data.state === 'completed' && !isBuy) {
          onClose();
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [channelToken, connect, onClose, appClient, navigate, isBuy, errorToast]);

  useMemo(() => {
    url && onOpen();
  }, [onOpen, url]);

  return (
    <>
      <Button
        variant="primary"
        p={6}
        fontSize="md"
        onClick={handleFarcasterSignIn}
      >
        <Icon as={FarcasterIcon} />
        <Text ml={2}>Farcaster</Text>
      </Button>
      <QRCodeDialog
        modalTitle="Scan the QR code to Sign In"
        modalSubtitle="Scan the QR code with your Farcaster app to sign in to Handles"
        isOpen={isOpen}
        onClose={onClose}
        uri={url ?? ''}
        // biome-ignore lint/correctness/noChildrenProp: <explanation>
        children={null}
      />
    </>
  );
};
