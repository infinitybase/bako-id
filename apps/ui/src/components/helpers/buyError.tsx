import { Box, Flex, Text, type BoxProps } from '@chakra-ui/react';
import type { BN } from 'fuels';
import { ErrorIcon } from '../icons/errorIcon';

interface IBuyErrorProps extends BoxProps {
  buyError?: string;
  walletBalance: BN | null;
  totalPrice: BN;
}

export const BuyError = ({
  totalPrice,
  buyError,
  walletBalance,
}: IBuyErrorProps) => {
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

      {walletBalance?.lt(totalPrice) && !buyError && (
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
            {walletBalance?.lt(totalPrice) && (
              <Text>
                You need at least {totalPrice.format()} ETH to buy this domain.
              </Text>
            )}
            {buyError !== undefined && <Text>{buyError}</Text>}
          </Flex>
        </Box>
      )}
    </Box>
  );
};
