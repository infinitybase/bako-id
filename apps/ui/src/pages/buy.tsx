import { Button, Center, Stack, Text, VStack } from '@chakra-ui/react';
import { BuyComponents } from '../components/buy';
import { Connect, GoBack } from '../components/helpers';
import { calculateDomainPrice } from '../utils/calculator.ts';

// This component maybe too big, but it's all the page needs
export const Buy = () => {
  const totalPrice = domains.reduce(
    (previous, current) => previous + calculateDomainPrice(current.name, 1),
    0,
  );

  const button = () => {
    if (wallet) {
      return (
        <Button
          w="full"
          isLoading={
            resolveDomainMutation.isPending || registerDomainMutation.isPending
          }
          isDisabled={!wallet}
          onClick={handleBuyDomain}
          background="button.500"
          color="background.500"
          fontSize={14}
          _hover={{ bgColor: 'button.600' }}
        >
          Buy
        </Button>
      );
    }

    return <Connect />;
  };

  return (
    <Center
      w="full"
      h="full"
      display="flex"
      flexDir="column"
      py={2}
      px={{ base: 4, md: 20, xl: 40 }}
      zIndex={10}
    >
      <GoBack />
      <Stack
        w="full"
        h="full"
        direction={{ base: 'column', md: 'row' }}
        justifyContent="center"
        alignItems={{ base: 'center', md: 'start' }}
        gap={{ base: 6, md: 28, lg: 40 }}
        mt={2}
      >
        <VStack w="full" maxW="420px" alignItems="start">
          <BuyComponents.Domains>
            {domains.map(({ name }, index) => (
              <BuyComponents.Info
                name={name}
                index={index}
                periodHandle={handlePeriodChange}
              />
            ))}
          </BuyComponents.Domains>
        </VStack>
        <VStack h="full" w="full" maxW="420px" alignItems="start" spacing={4}>
          <Text color="section.200" fontWeight={600}>
            Your purchase
          </Text>
          <BuyComponents.Checkout
            length={domains.length}
            totalPrice={totalPrice}
            networkFee={0.003872}
          />
          {button()}
        </VStack>
      </Stack>
    </Center>
  );
};
