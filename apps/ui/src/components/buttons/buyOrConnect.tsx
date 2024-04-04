import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { WalletIcon } from '..';
import { ConnectButton } from './connectButton';

interface IBuyOrConnectProps {
  wallet: boolean;
  handleBuyDomain: () => void;
  walletBalance: number;
  totalPrice: number;
  isLoadingBalance: boolean;
  signInLoad: boolean;
}

export const BuyOrConnectButton = ({
  handleBuyDomain,
  isLoadingBalance,
  signInLoad,
  totalPrice,
  wallet,
  walletBalance,
}: IBuyOrConnectProps) => {
  if (wallet) {
    return (
      <>
        <Box
          w="full"
          h="fit-content"
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Button
            w="full"
            isLoading={isLoadingBalance}
            isDisabled={!wallet || Number(walletBalance) < totalPrice}
            onClick={handleBuyDomain}
            background="button.500"
            color="background.500"
            fontSize={14}
            _hover={{ bgColor: 'button.600' }}
          >
            <Flex align="center" gap={2}>
              <WalletIcon w={4} h={4} />
              {signInLoad ? (
                <Text>Signing...</Text>
              ) : (
                <Text>Confirm Transaction</Text>
              )}
            </Flex>
          </Button>
        </Box>
      </>
    );
  }

  return <ConnectButton />;
};
