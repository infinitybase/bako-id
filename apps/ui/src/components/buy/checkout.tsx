import { Button, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { useBuy } from '../../modules/buy/hooks';
import { Coin } from '../../types';
const { ETH, USD } = Coin;

interface CheckoutProps {
  length?: number;
  networkFee: number;
}

export const Checkout = ({ networkFee }: CheckoutProps) => {
  const { totalPrice, handleChangeCoin, selectedCoin, formatCoin } = useBuy();
  // const multipleBuys = length > 1 ? 'Domains' : 'Domain';

  return (
    <VStack
      w="full"
      bg="background.900"
      p=".5rem 1rem 1rem 1rem"
      borderRadius={8}
    >
      <HStack w="full">
        <Text fontSize="medium" fontWeight={600} color="white">
          Details
        </Text>
        <Spacer />
        <HStack p={2} spacing={2} borderRadius="lg">
          <Button
            w={12}
            h={7}
            onClick={() => handleChangeCoin(ETH)}
            bgColor={selectedCoin === ETH ? 'button.500' : 'grey.600'}
            color={selectedCoin === ETH ? 'background.900' : 'grey.400'}
            fontSize="sm"
            borderRadius="md"
          >
            {ETH}
          </Button>
          <Button
            border="none"
            w={12}
            h={7}
            onClick={() => handleChangeCoin(USD)}
            bgColor={selectedCoin === USD ? 'button.500' : 'grey.600'}
            color={selectedCoin === USD ? 'background.900' : 'grey.400'}
            fontSize="sm"
          >
            {USD}
          </Button>
        </HStack>
      </HStack>
      <VStack
        w="full"
        spacing={1}
        bgColor="rgba(245,245,245, 5%)"
        p={3}
        borderRadius="lg"
      >
        <Flex w="full" justifyContent="space-between">
          <Text color="text.500" fontSize="sm">
            Handles
          </Text>
          <Text color="text.500" fontSize="sm">
            {formatCoin(totalPrice, selectedCoin)}
          </Text>
        </Flex>
        <Flex w="full" justifyContent="space-between">
          <Text color="text.500" fontSize="sm">
            Estimated network fee
          </Text>
          <Spacer />
          <Text color="text.500" fontSize="sm">
            {formatCoin(networkFee, selectedCoin)}
          </Text>
        </Flex>
        <HStack w="full">
          <Text color="text.500" fontSize="sm">
            Estimated total
          </Text>
          <Spacer />
          <Text color="text.500" fontSize="sm">
            {formatCoin(totalPrice + networkFee, selectedCoin)}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};
