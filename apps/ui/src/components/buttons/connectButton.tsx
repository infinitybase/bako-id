import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { DrawerConnector } from '..';
import { useFuelConnect } from '../../hooks';
import { WalletIcon } from '../icons/wallet';

export const ConnectButton = () => {
  const { connectors } = useFuelConnect();

  return (
    <>
      <Button
        onClick={connectors.drawer.onOpen}
        alignItems="center"
        w="full"
        display="flex"
        gap={2}
        bgColor="button.500"
        fontSize="sm"
        _hover={{ bgColor: 'button.600' }}
        className="transition-all-05"
      >
        {!connectors.isConnecting ? (
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
      <DrawerConnector
        isOpen={connectors.drawer.isOpen}
        onClose={connectors.drawer.onClose}
        onSelect={connectors.select}
        connectors={connectors.item}
      />
    </>
  );
};
