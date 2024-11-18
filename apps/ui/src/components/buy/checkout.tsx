import {
  Button,
  Flex,
  HStack,
  Skeleton,
  Spacer,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import type { UseBuyReturn } from '../../modules/buy/hooks';
import { Coin } from '../../types';

const { ETH, USD } = Coin;

interface CheckoutProps extends UseBuyReturn {}

export const Checkout = (props: CheckoutProps) => {
  const {
    totalPrice,
    handleChangeCoin,
    selectedCoin,
    formatCoin,
    fee,
    domainPrice,
    loading,
  } = props;
  // const multipleBuys = length > 1 ? 'Domains' : 'Domain';
  const [isMobile] = useMediaQuery('(max-width: 22em)');

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
        <HStack py={2} spacing={2} borderRadius="lg">
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
          {/*<Button*/}
          {/*  border="none"*/}
          {/*  w={12}*/}
          {/*  h={7}*/}
          {/*  onClick={() => handleChangeCoin(USD)}*/}
          {/*  bgColor={selectedCoin === USD ? 'button.500' : 'grey.600'}*/}
          {/*  color={selectedCoin === USD ? 'background.900' : 'grey.400'}*/}
          {/*  fontSize="sm"*/}
          {/*>*/}
          {/*  {USD}*/}
          {/*</Button>*/}
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
          <Text color="text.500" fontSize={['xs', 'sm']}>
            Handles
          </Text>
          <Text color="text.500" fontSize={['xs', 'sm']}>
            {!loading ? (
              domainPrice ? (
                formatCoin(domainPrice, selectedCoin)
              ) : (
                '--.--'
              )
            ) : (
              <Skeleton w={24} h={5} rounded="lg" />
            )}
          </Text>
        </Flex>
        <Flex w="full" justifyContent="space-between">
          <Text color="text.500" fontSize={['xs', 'sm']}>
            {isMobile ? 'Est.' : 'Estimated'} network fee
          </Text>
          <Spacer />
          <Text
            color="text.500"
            overflowWrap="break-word"
            fontSize={['xs', 'sm']}
          >
            {!loading ? (
              fee ? (
                formatCoin(fee ?? bn(0), selectedCoin)
              ) : (
                '--.--'
              )
            ) : (
              <Skeleton w={24} h={5} rounded="lg" />
            )}
          </Text>
        </Flex>
        <HStack w="full">
          <Text color="text.500" fontSize={['xs', 'sm']}>
            Estimated total
          </Text>
          <Spacer />
          <Text color="text.500" fontSize={['xs', 'sm']}>
            {!loading ? (
              totalPrice ? (
                formatCoin(totalPrice, selectedCoin)
              ) : (
                '--.--'
              )
            ) : (
              <Skeleton w={24} h={5} rounded="lg" />
            )}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};
