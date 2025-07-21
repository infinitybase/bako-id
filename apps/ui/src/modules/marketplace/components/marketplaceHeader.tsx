import { Box, Center, Flex, Image } from '@chakra-ui/react';
import {
  useAccount,
  useConnectUI,
  useDisconnect,
  useIsConnected,
  useWallet,
} from '@fuels/react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useGetPrimaryHandleName } from '../../../hooks';
import { formatAddress } from '../../../utils/formatter';
import { MarketplaceConnect } from './marketplaceConnectButton';
import Logo from '@/assets/marketplace/logo-garage.svg';

export const MarketplaceHeader = () => {
  const [initialLoadState, setInitialLoadState] = useState(true);

  const navigate = useNavigate();

  const { isConnecting, connectors, isConnected } = useConnectUI();
  const { account } = useAccount();

  const { isPending: disconnectLoading } = useDisconnect();

  const { isFetching } = useIsConnected();

  const { wallet } = useWallet({
    account,
  });

  const isAdapterLoading = useMemo(() => {
    return isFetching && connectors.length === 0 && !account;
  }, [isFetching, connectors, account]);

  const isWalletLoading = useMemo(() => {
    return isConnecting || disconnectLoading || isAdapterLoading;
  }, [isConnecting, disconnectLoading, isAdapterLoading]);

  const { data: primaryHandle, isLoading: isPrimaryHandleLoading } =
    useGetPrimaryHandleName();

  useEffect(() => {
    if (!isWalletLoading && wallet && !isPrimaryHandleLoading) {
      setInitialLoadState(false);
    }

    // This is necessary to turn the state to false when users refresh the page in the home and aren't connected,
    // due the wallet request only happens when user is actually connected.
    // We can't depends on the isPrimaryHandleLoading state either, because it also needs the wallet to complete the request.
    if (!isConnected && !isWalletLoading) {
      setInitialLoadState(false);
    }
  }, [isWalletLoading, wallet, isPrimaryHandleLoading, isConnected]);

  const domain = primaryHandle ?? formatAddress(wallet?.address.toB256() ?? '');

  const goHome = () => {
    navigate({ to: '/' }).then();
  };

  return (
    <Center
      as="header"
      w="full"
      minH="72px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      bg="input.900"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        w="full"
        maxW="1920px"
        mx="auto"
        px="14px"
      >
        <Box
          display="flex"
          alignItems="center"
          onClick={goHome}
          cursor="pointer"
        >
          <Image src={Logo} alt="Logo" />
        </Box>
        <MarketplaceConnect isLoading={initialLoadState} domain={domain!} />
      </Flex>
    </Center>
  );
};
