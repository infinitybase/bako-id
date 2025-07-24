import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useFuel } from '@fuels/react';
import { WalletIcon2 } from '@/modules/marketplace/components/icons/wallet2';
import { useCustomToast, UserIcon } from '@/components';
import { useNavigate } from '@tanstack/react-router';
import { isB256, type Account } from 'fuels';
import { formatAddress } from '@/utils/formatter';
import { CopyIcon } from '@/components/icons/copyIcon';
import { LogoutIcon } from './icons/logoutIcon';

export const MarketplaceConnect = ({
  isLoading,
  domain,
  isConnecting,
  isConnected,
  connect,
  wallet,
}: {
  isLoading: boolean;
  domain: string;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => void;
  wallet: Account | null;
}) => {
  const navigate = useNavigate();
  const { successToast } = useCustomToast();

  const isWalletAddress = isB256(domain ?? '');

  const copy = () => {
    navigator.clipboard.writeText(wallet?.address.toB256() ?? '');
    successToast({
      title: 'Address copied to clipboard',
    });
  };

  const parsedDomain = isWalletAddress
    ? formatAddress(domain, 5)
    : `@${domain}`;

  const {
    fuel: { disconnect },
  } = useFuel();
  const handleLogout = async () => {
    await disconnect();
    navigate({ to: '/' });
  };

  const handleRedirect = () => {
    navigate({
      to: '/profile/$name',
      params: { name: parsedDomain },
    });
  };

  if (isLoading) {
    return null;
  }

  return (
    <Menu placement="bottom-end">
      <MenuButton
        onClick={() => {
          if (isConnected && wallet) {
            return;
          }
          connect();
        }}
        alignItems="center"
        disabled={isConnecting}
        display="flex"
        gap={2}
        bg="input.600"
        color="#fff"
        borderRadius="8px"
        fontSize="12px"
        h="28px"
        fontWeight={500}
        boxShadow="0px 8px 16px 0px rgba(0, 0, 0, 0.25)"
        letterSpacing="0.2px"
        lineHeight="1.2"
        py="6px"
        px="8px"
        maxW={isConnected ? '107px' : '130px'}
        _hover={{ bg: 'input.500' }}
      >
        {isConnected && wallet ? (
          <Flex alignItems="center" justifyContent="space-between" gap={2}>
            <Text textAlign="center" w="fit-content">
              {parsedDomain}
            </Text>
            <Icon as={WalletIcon2} h={5} w={4} pb={1} />
          </Flex>
        ) : (
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <Text>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</Text>
            {!isConnecting && (
              <Icon as={WalletIcon2} alignSelf="center" h={5} w={4} pb={1} />
            )}
          </Box>
        )}
      </MenuButton>
      {isConnected && (
        <MenuList
          bg="input.600"
          color="#fff"
          border="1px solid"
          borderColor="grey.400"
          m={0}
          p={0}
          minW="145px"
        >
          <MenuItem
            w="full"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="transparent"
            py={3}
            px={2}
            borderBottom="1px solid"
            borderColor="grey.400"
            onClick={handleRedirect}
            _hover={{ bg: 'input.500' }}
            borderRadius="8px 8px 0 0"
          >
            <Text
              onClick={handleRedirect}
              fontSize="12px"
              letterSpacing="0.5px"
              lineHeight="1.2"
            >
              Profile
            </Text>
            <Icon as={UserIcon} />
          </MenuItem>
          <MenuItem
            w="full"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="transparent"
            py={3}
            px={2}
            borderBottom="1px solid"
            borderColor="grey.400"
            onClick={copy}
            _hover={{ bg: 'input.500' }}
          >
            <Text fontSize="12px" letterSpacing="0.5px" lineHeight="1.2">
              {parsedDomain}
            </Text>
            <Icon as={CopyIcon} cursor="pointer" />
          </MenuItem>
          <MenuItem
            w="full"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="transparent"
            py={3}
            px={2}
            onClick={handleLogout}
            _hover={{ bg: 'input.500' }}
            borderRadius="0 0 8px 8px"
          >
            <Text fontSize="12px" letterSpacing="0.5px" lineHeight="1.2">
              Disconnect
            </Text>
            <Icon as={LogoutIcon} />
          </MenuItem>
        </MenuList>
      )}
    </Menu>
  );
};
