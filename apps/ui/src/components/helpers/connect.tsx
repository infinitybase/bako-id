import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { useConnectUI } from '@fuels/react';
import { useScreenSize } from '../../hooks/useScreenSize';
import { WalletIcon } from '../icons/wallet';

export const Connect = () => {
  const { isMobile } = useScreenSize();
  const { connect, isConnecting, isError: isConnectError } = useConnectUI();

  return (
    <>
      <Button
        onClick={connect}
        alignItems="center"
        w="full"
        display="flex"
        gap={2}
        bgColor={{ base: 'transparent', md: 'button.500' }}
        fontSize="sm"
        color={{ base: 'button.500', md: 'background.500' }}
        _hover={{ bgColor: 'button.600' }}
        className="transition-all-05"
      >
        {!isConnecting && !isConnectError ? (
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            {!isMobile && (
              <Icon
                as={WalletIcon}
                alignSelf="center"
                h={4}
                w={4}
                color="background.500"
              />
            )}
            <Text>Connect Wallet</Text>
            {isMobile && (
              <Icon
                as={WalletIcon}
                alignSelf="center"
                h={4}
                w={4}
                color="button.500"
              />
            )}
          </Box>
        ) : (
          <Text>Connecting...</Text>
        )}
      </Button>
      {/*<DrawerConnector*/}
      {/*  isOpen={connectors.drawer.isOpen}*/}
      {/*  onClose={connectors.drawer.onClose}*/}
      {/*  onSelect={connectors.select}*/}
      {/*  connectors={connectors.item}*/}
      {/*/>*/}
    </>
  );
};
