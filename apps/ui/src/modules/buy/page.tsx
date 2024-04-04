import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BuyComponents } from '../../components';
import { BuyOrConnectButton } from '../../components/buttons';
import { GoBack } from '../../components/helpers';
import { BuyError } from '../../components/helpers/buyError';
import { useFuelConnect } from '../../hooks';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useBuy } from './hooks/useBuy';

export const Buy = () => {
  const { wallet } = useFuelConnect();
  const {
    domains,
    handlePeriodChange,
    buyError,
    totalPrice,
    handleBuyDomain,
    isLoadingBalance,
    signInLoad,
    walletBalance,
  } = useBuy();

  const { isMobile } = useScreenSize();

  const BuyButton = (
    <BuyOrConnectButton
      handleBuyDomain={handleBuyDomain}
      isLoadingBalance={isLoadingBalance}
      signInLoad={signInLoad}
      totalPrice={totalPrice}
      wallet={!!wallet}
      walletBalance={Number(walletBalance)}
    />
  );

  return (
    <Box
      w="full"
      h="full"
      display="flex"
      alignItems="center"
      mt={[12, 24, 0]}
      gap={12}
      flexDirection="column"
      overflow="hidden"
    >
      {!isMobile && <GoBack />}
      <Card
        border="1px solid"
        borderColor="stroke.500"
        p={6}
        w={['95%', '70%', '35%']}
        h={['70%', '55%', '60%']}
        alignSelf="center"
        display="flex"
        flexDir="column"
      >
        <CardHeader color="section.200" fontSize="md" fontWeight="bold">
          Handles
          <Text fontSize="xs" color="grey.subtitle" fontWeight="normal">
            Set how many years do you want to be owner of this Handles.
          </Text>
        </CardHeader>
        <CardBody>
          <VStack mt={3}>
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
          <VStack h="full" w="full" alignItems="start" mt={12} spacing={5}>
            <Box>
              <Text color="section.200" fontWeight="bold">
                Your purchase
              </Text>
              <Text color="grey.subtitle" fontSize="xs">
                Select the token that you want to use for this purchase.
              </Text>
            </Box>
            <BuyComponents.Checkout
              length={domains.length}
              networkFee={0.003872}
            />
          </VStack>
        </CardBody>
        <BuyError
          totalPrice={totalPrice}
          walletBalance={Number(walletBalance)}
          buyError={buyError}
        />
        {!isMobile && BuyButton}
      </Card>
      {isMobile && (
        <Box w="full" p={5} position="absolute" bottom={0}>
          {BuyButton}
        </Box>
      )}
    </Box>
  );
};
