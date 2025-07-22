import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { useAccount, useConnectUI, useWallet } from '@fuels/react';
import { WalletIcon2 } from '@/modules/marketplace/components/icons/wallet2';
import { ConnectButtonMenu } from './connectButtonMenu';

export const MarketplaceConnect = ({
  isLoading,
  domain,
}: {
  isLoading: boolean;
  domain: string | null | undefined;
}) => {
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
        disabled={isConnecting}
        display="flex"
        gap={2}
        background="rgba(245,245,245,0.08)"
        color="#fff"
        borderRadius="8px"
        fontSize="12px"
        h="33.5px"
        padding="2px 8px"
        fontWeight={500}
        boxShadow="none"
        outline="none"
        letterSpacing="0.5px"
        lineHeight="1.2"
        w="130px"
        _hover={{ background: 'rgba(255,255,255,0.06)' }}
        className="transition-all-05"
      >
        {isConnecting && <Text>Connecting...</Text>}
        {!isConnecting && !wallet && (
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <Text>Connect Wallet</Text>

            <Icon
              as={WalletIcon2}
              alignSelf="center"
              h={4}
              w={4}
              color="#F5F5F5"
            />
          </Box>
        )}
      </Button>
    );
  }

  return (
    <ConnectButtonMenu name={domain ?? ''} account={wallet?.address ?? ''} />
  );
};
