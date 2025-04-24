import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  useMediaQuery,
} from '@chakra-ui/react';
import { useAccount, useWallet } from '@fuels/react';
import { useNavigate } from '@tanstack/react-router';
import { formatAddress } from '../../utils/formatter';
import { Connect } from '../helpers';
import { QuestionIcon } from '../icons/question';
import { Info } from '../user';
import { FileIcon } from '../icons';

export const Header = () => {
  const [isMobile] = useMediaQuery('(max-width: 48em)');
  const navigate = useNavigate();

  const { account: accountAddress } = useAccount();
  const { wallet } = useWallet({ account: accountAddress });

  const goHome = () => {
    navigate({ to: '/' }).then();
  };

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
        <Flex w="full" gap={2}>
          {!isMobile && wallet !== null && (
            <Button
              w="fit-content"
              bgColor="transparent"
              _hover={{
                bgColor: 'transparent',
                color: 'button.500',
              }}
              color="grey.100"
              fontWeight="normal"
              fontSize="sm"
              rightIcon={<FileIcon w={4} h={4} />}
              onClick={() => navigate({ to: '/my-handles' })}
            >
              My Handles
            </Button>
          )}
          {wallet ? (
            <Info
              name={formatAddress(wallet.address.toB256())!}
              account={wallet.address}
            />
          ) : (
            <Box mr={isMobile ? 3 : 0}>
              <Connect />
            </Box>
          )}
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
