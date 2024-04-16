import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Skeleton,
} from '@chakra-ui/react';
import { useIsConnected } from '@fuels/react';
import { useNavigate } from '@tanstack/react-router';
import { useFuelConnect } from '../../hooks';
import { useScreenSize } from '../../hooks/useScreenSize';
import { formatAddress } from '../../utils/formatter';
import { Connect } from '../helpers';
import { FileIcon } from '../icons/fileIcon';
import { QuestionIcon } from '../icons/question';
import { Info } from '../user';

export const Header = () => {
  const { wallet } = useFuelConnect();
  const { isFetching } = useIsConnected();
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();

  const account = () => {
    if (isFetching && wallet === undefined) {
      return <Skeleton height="2.5rem" w="7rem" rounded={8} />;
    }
    if (wallet) {
      return (
        <Info
          name={formatAddress(wallet.address.toB256().toString())!}
          account={wallet.address}
        />
      );
    }
    if (!isFetching && wallet === null)
      return (
        <Box>
          <Connect />
        </Box>
      );
  };

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
      px={[0, 8, 8]}
      className="transition-all-05"
    >
      <button onClick={goHome}>
        <Image src="/bakoID-logo.svg" width={190} height={75} alt="Bako logo" />
      </button>

      <Flex w="fit-content" align="center" justify="flex-end" gap={2}>
        <Flex w="full">
          <Button
            w="full"
            bgColor="transparent"
            _hover={{
              bgColor: 'transparent',
              color: 'button.500',
            }}
            color="grey.100"
            fontWeight="normal"
            fontSize="sm"
            rightIcon={<FileIcon w={4} h={4} />}
          >
            My Handles
          </Button>
          {account()}
        </Flex>
        {!isMobile && (
          <Box w="fit-content" ml={wallet ? 16 : 0}>
            <Icon
              _hover={{
                cursor: 'pointer',
                opacity: 0.8,
              }}
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
