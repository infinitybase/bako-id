import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { DrawerConnector } from '..';
import { useFuelConnect } from '../../hooks';
import { useScreenSize } from '../../hooks/useScreenSize';
import { WalletIcon } from '../icons/wallet';

export const Connect = () => {
  const { connectors } = useFuelConnect();
  const { isMobile } = useScreenSize();

  return (
    <>
      <Button
        onClick={connectors.drawer.onOpen}
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
          <Text>Connect wallet</Text>
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
