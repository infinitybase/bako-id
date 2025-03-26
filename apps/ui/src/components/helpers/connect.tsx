import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { useAccount, useConnectUI, useWallet } from '@fuels/react';
import { useScreenSize } from '../../hooks/useScreenSize';
import { WalletIcon } from '../icons/wallet';
import { Info } from '../user';

export const Connect = ({
  isLoading,
  domain,
}: {
  isLoading: boolean;
  domain: string;
}) => {
  const { isMobile } = useScreenSize();

  const { connect, isConnecting, isConnected } = useConnectUI();
  const { account } = useAccount();
  const { wallet } = useWallet({
    account,
  });

  if (isLoading) {
    return null;
  }

  if (!isConnected && !wallet) {
    return (
      <Button
        onClick={connect}
        alignItems="center"
        w="full"
        disabled={isConnecting}
        display="flex"
        gap={2}
        bgColor={{ base: 'transparent', md: 'button.500' }}
        fontSize="sm"
        color={{ base: 'button.500', md: 'background.500' }}
        _hover={{ bgColor: 'button.600' }}
        className="transition-all-05"
      >
        {isConnecting && <Text>Connecting...</Text>}
        {!isConnecting && !account && (
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
        )}
      </Button>
    );
  }

  return <Info name={domain!} account={wallet?.address ?? ' '} />;
};
