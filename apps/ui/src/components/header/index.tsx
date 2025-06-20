import {
  Box,
  Center,
  Flex,
  Icon,
  Image,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  useAccount,
  useConnectUI,
  useDisconnect,
  useIsConnected,
  useWallet,
} from '@fuels/react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useGetPrimaryHandleName } from '../../hooks';
import { formatAddress } from '../../utils/formatter';
import { Connect } from '../helpers';
import { FileIcon } from '../icons';
import { ExchangeBoxIcon } from '../icons/exchangeBoxIcon';
import { QuestionIcon } from '../icons/question';
import { NavLinkItem } from '../navLinkItem';

export const Header = () => {
  const [initialLoadState, setInitialLoadState] = useState(true);

  const [isMobile] = useMediaQuery('(max-width: 48em)');
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

  const showMarketplaceLink = isMobile ? !wallet : true;

  return (
    <Center
      as="header"
      w="full"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgColor="background.900"
      py={2}
      px={[0, isMobile ? 0 : 6, 6, 6]}
      className="transition-all-05"
    >
      <Image
        src={isMobile ? '/logo.svg' : '/bakoID-logo.svg'}
        cursor="pointer"
        onClick={goHome}
        width={['5rem', '6rem', '7rem', '8rem']}
        height={['4rem', '4rem', '5rem', '5rem']}
        alt="Bako logo"
      />

      <Flex w="fit-content" align="center" justify="flex-end" gap={2}>
        <Flex w="full" alignItems="center" gap={2} flex={1}>
          {showMarketplaceLink && (
            <NavLinkItem
              href="/marketplace"
              label="Marketplace"
              icon={<ExchangeBoxIcon w={4} h={4} />}
              isBeta
            />
          )}
          {!isMobile && wallet !== null && !initialLoadState && (
            <NavLinkItem
              href="/my-handles"
              label="My Handles"
              icon={<FileIcon w={4} h={4} />}
            />
          )}
          <Connect isLoading={initialLoadState} domain={domain!} />
        </Flex>
        {!isMobile && (
          <Box w="fit-content">
            <Icon
              _hover={{
                cursor: 'pointer',
                opacity: 0.8,
              }}
              onClick={() => window.open('https://docs.bako.id/', '_blank')}
              ml={4}
              as={QuestionIcon}
              w={6}
              h={6}
            />
          </Box>
        )}
      </Flex>
    </Center>
  );
};
