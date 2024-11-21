import { Box, Flex, Text, type BoxProps } from '@chakra-ui/react';
import type { BN } from 'fuels';
import { ErrorIcon } from '../icons/errorIcon';
import { Coin } from '../../types';

interface IBuyErrorProps extends BoxProps {
  buyError?: string;
  walletBalance: BN | null;
  totalPrice: BN;
  totalPriceETH: BN;
  selectedCoin: Coin;
}

export const BuyError = ({
  totalPrice,
  totalPriceETH,
  buyError,
  walletBalance,
  selectedCoin,
}: IBuyErrorProps) => {
  const formattedTotalPrice = () => {
    const price = totalPrice.format();

    if (selectedCoin === Coin.ETH) return price;

    return Number(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Box maxW="full" h="auto" display="flex" my={2}>
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

      {walletBalance?.lt(totalPriceETH) && !buyError && (
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
            {walletBalance?.lt(totalPriceETH) && (
              <Text>
                You need at least {formattedTotalPrice()}
                {selectedCoin} to buy this domain.
              </Text>
            )}
            {buyError !== undefined && <Text>{buyError}</Text>}
          </Flex>
        </Box>
      )}
    </Box>
  );
};
