import { Button } from '@chakra-ui/react';
import { Connect } from '..';
import { useDomain, useFuelConnect } from '../../hooks';
import { useBuy } from '../../modules/buy/hooks/useBuy';

export const BuyOrConnectButton = () => {
  const { wallet } = useFuelConnect();
  const { handleBuyDomain } = useBuy();
  const { resolveDomain, registerDomain } = useDomain();

  if (wallet) {
    return (
      <Button
        w="full"
        isLoading={resolveDomain.isPending || registerDomain.isPending}
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
