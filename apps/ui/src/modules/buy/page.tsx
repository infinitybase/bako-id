import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BuyComponents, ResolverAutocomplete } from '../../components';
import { BuyOrConnectButton } from '../../components/buttons';
import { GoBack } from '../../components/helpers';
import { BuyError } from '../../components/helpers/buyError';
import { useScreenSize } from '../../hooks/useScreenSize';
import type { Domains } from '../../types';
import { Purchased } from '../purchased/page';
import { useBuy } from './hooks/useBuy';
import { useResolverForm } from './hooks/useResolverForm';

export const Buy = () => {
  const {
    control,
    errors,
    handleResolverAddressChange,
    isValid,
    resolverAddress,
    wallet,
    isResolverValidatingFetching,
  } = useResolverForm();

  const buy = useBuy();

  const {
    domains,
    handlePeriodChange,
    buyError,
    totalPrice,
    handleBuyDomain,
    isLoadingBalance,
    signInLoad,
    walletBalance,
    registerDomain,
    domain,
    signProgress,
  } = buy;

  const { isMobile } = useScreenSize();

  if (registerDomain.isSuccess && registerDomain.data && !signInLoad) {
    return (
      <Purchased
        domain={domain}
        transactionId={registerDomain.data.transactionId}
        transaction={registerDomain.data.transactionResult}
      />
    );
  }

  const BuyButton = (
    <BuyOrConnectButton
      progress={signProgress}
      handleBuyDomain={() => handleBuyDomain(resolverAddress)}
      isLoadingBalance={isLoadingBalance}
      signInLoad={signInLoad}
      totalPrice={totalPrice}
      wallet={!!wallet}
      walletBalance={walletBalance}
      isDisabled={!!errors.resolver?.message || !isValid}
    />
  );

  return (
    <Box
      w="full"
      h="full"
      display="flex"
      alignItems="center"
      mt={[12, 12, 0, 0]}
      gap={[12, 12, 12, 12]}
      mb={[0, 0, 'auto', 0]}
      flexDirection="column"
    >
      {!isMobile && <GoBack />}
      <Card
        border="1px solid"
        borderColor="stroke.500"
        p={5}
        w={['95%', 'lg', 'lg', 'lg']}
        h="auto"
        gap={2}
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
              {domains.map(({ name }: Domains, index) => (
                <BuyComponents.Info
                  key={name}
                  name={name}
                  index={index}
                  periodHandle={handlePeriodChange}
                />
              ))}
            </BuyComponents.Domains>
          </VStack>

          <Stack mt={10} mb={1}>
            <Box>
              <Text color="section.200" fontWeight="bold">
                Resolver
              </Text>
              <Text color="grey.subtitle" fontSize="xs">
                The address is your connected account by default. You can modify
                it manually pasting another address.
              </Text>
            </Box>

            <ResolverAutocomplete
              handleChange={handleResolverAddressChange}
              inputValue={resolverAddress}
              isValid={isValid ?? false}
              errors={errors}
              control={control}
              isLoading={isResolverValidatingFetching}
            />
          </Stack>
          <VStack h="full" w="full" alignItems="start" spacing={5}>
            <Box>
              <Text color="section.200" fontWeight="bold">
                Your purchase
              </Text>
              <Text color="grey.subtitle" fontSize="xs">
                Select the token that you want to use for this purchase.
              </Text>
            </Box>
            <BuyComponents.Checkout {...buy} />
          </VStack>
        </CardBody>
        <BuyError
          totalPrice={totalPrice}
          walletBalance={walletBalance}
          buyError={buyError}
        />
        {!isMobile && BuyButton}
      </Card>
      {isMobile && (
        <Box
          w="full"
          p={5}
          position="absolute"
          bottom={0}
          bgColor="background.900"
        >
          {BuyButton}
        </Box>
      )}
    </Box>
  );
};
