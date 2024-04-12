import { Box, Flex, Text, type BoxProps } from '@chakra-ui/react';
import { ErrorIcon } from '../icons/errorIcon';

interface IBuyErrorProps extends BoxProps {
  buyError?: string;
  walletBalance: number;
  totalPrice: number;
}

export const BuyError = ({
  totalPrice,
  buyError,
  walletBalance,
}: IBuyErrorProps) => {
  return (
    <Box maxW="full" h="fit-content" display="flex" mb={3}>
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
    </Box>
  );
};
