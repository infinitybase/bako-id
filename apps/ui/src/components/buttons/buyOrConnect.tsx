import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Connect } from '..';
import { useDomain, useFuelConnect } from '../../hooks';
import { useBuy } from '../../modules/buy/hooks/useBuy';
import { ErrorIcon } from '../icons/errorIcon';

export const BuyOrConnectButton = () => {
  const { wallet } = useFuelConnect();
  const {
    handleBuyDomain,
    walletBalance,
    totalPrice,
    isLoadingBalance,
    buyError,
  } = useBuy();
  const { resolveDomain, registerDomain } = useDomain();

  if (wallet) {
    return (
      <Box
        w="full"
        h="fit-content"
        display="flex"
        flexDirection="column"
        gap={3}
      >
        {buyError && (
          <Box
            w="full"
            h={10}
            background="error.backgroundBlur"
            rounded="lg"
            border="1px solid"
            borderColor="error.stroke"
            color="error.500"
            fontSize={14}
          >
            <Flex h="full" align="center" ml={4} gap={2}>
              <ErrorIcon w={4} h={4} />
              <Text>{buyError}</Text>
            </Flex>
          </Box>
        )}
        {Number(walletBalance) < totalPrice && !buyError && (
          <Box
            w="full"
            h={10}
            background="error.backgroundBlur"
            rounded="lg"
            border="1px solid"
            borderColor="error.stroke"
            color="error.500"
            fontSize={14}
          >
            <Flex h="full" align="center" ml={4} gap={2}>
              <ErrorIcon w={4} h={4} />
              {Number(walletBalance) < totalPrice && (
                <Text>
                  You need at least {totalPrice} ETH to buy this domain.
                </Text>
              )}
              {buyError !== undefined && <Text>{buyError}</Text>}
            </Flex>
          </Box>
        )}
        <Button
          w="full"
          isLoading={
            resolveDomain.isPending ||
            registerDomain.isPending ||
            isLoadingBalance
          }
          isDisabled={!wallet || Number(walletBalance) < totalPrice}
          onClick={handleBuyDomain}
          background="button.500"
          color="background.500"
          fontSize={14}
          _hover={{ bgColor: 'button.600' }}
        >
          Buy
        </Button>
      </Box>
    );
  }

  return <Connect />;
};
