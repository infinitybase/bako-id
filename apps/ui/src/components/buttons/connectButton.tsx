import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { useConnectUI } from '@fuels/react';
import { WalletIcon } from '../icons/wallet';

export const ConnectButton = () => {
  const { connect, isConnected, isConnecting } = useConnectUI();

  if (isConnected) return null;

  return (
    <>
      <Button
        onClick={connect}
        alignItems="center"
        w="full"
        display="flex"
        gap={2}
        bgColor="button.500"
        fontSize="sm"
        _hover={{ bgColor: 'button.600' }}
        className="transition-all-05"
      >
        {!isConnecting ? (
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <Icon
              as={WalletIcon}
              alignSelf="center"
              h={4}
              w={4}
              color="background.500"
            />

            <Text color="background.500">Connect Wallet</Text>
          </Box>
        ) : (
          <Text color="background.500">Connecting...</Text>
        )}
      </Button>
    </>
  );
};
