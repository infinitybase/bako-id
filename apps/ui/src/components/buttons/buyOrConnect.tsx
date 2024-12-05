import { Box, Flex, Text } from '@chakra-ui/react';
import type { BN } from 'fuels';
import { ConnectButton } from './connectButton';
import { ProgressButton } from './progressButton';
import { useEffect, useState } from 'react';
import { useConnectUI } from '@fuels/react';

interface IBuyOrConnectProps {
  wallet: boolean;
  handleBuyDomain: () => void;
  walletBalance: BN | null;
  totalPriceETH: BN;
  isLoadingBalance: boolean;
  signInLoad: boolean;
  isDisabled: boolean;
  progress: number;
}

export const BuyOrConnectButton = ({
  handleBuyDomain,
  isLoadingBalance,
  signInLoad,
  totalPriceETH,
  wallet,
  walletBalance,
  isDisabled,
  progress,
}: IBuyOrConnectProps) => {
  const { connect, isConnected, isConnecting } = useConnectUI();

  const [connectProgress, setConnectProgress] = useState(0);

  useEffect(() => {
    if (isConnecting) {
      setConnectProgress(33);

      setTimeout(() => {
        setConnectProgress(66);
      }, 700);
    }

    if (isConnected) {
      setConnectProgress(100);
    }

    return () => {
      setConnectProgress(0);
    };
  }, [isConnecting, isConnected]);

  if (wallet && connectProgress === 100 && isConnected) {
    return (
      <Box
        w="full"
        h="fit-content"
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <ProgressButton
          progress={progress}
          w="full"
          isLoading={isLoadingBalance}
          isDisabled={!wallet || walletBalance?.lt(totalPriceETH) || isDisabled}
          onClick={handleBuyDomain}
          color="background.500"
          bg="button.500"
          fontSize={14}
          _hover={{ bgColor: 'button.600' }}
          progressColor="white"
        >
          <Flex align="center" gap={2}>
            {signInLoad ? (
              <Text>Signing...</Text>
            ) : (
              <Text>Confirm Transaction</Text>
            )}
          </Flex>
        </ProgressButton>
      </Box>
    );
  }

  return (
    <ConnectButton
      connect={connect}
      isConnecting={isConnecting}
      progress={connectProgress}
    />
  );
};
