import { ChevronDownIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useFuel } from '@fuels/react';
import type { AbstractAddress } from 'fuels';
import { useMemo, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { formatAddress } from '../../utils/formatter.ts';
import { RoundedUserIcon } from '../helpers/roundedUserIcon.tsx';
import { BeginnersGuide } from '../icons/beginnersGuide.tsx';
import { FileIcon } from '../icons/fileIcon.tsx';
import { HowToSendCrypto } from '../icons/howToSendCrypto.tsx';
import { LogoutIcon } from '../icons/logoutIcon.tsx';
import { MiningCrypto } from '../icons/miningCrypto.tsx';
import { MoreBako } from '../icons/moreBako.tsx';
import { NotificationsIcon } from '../icons/notificationsIcon.tsx';
import { useCustomToast } from '../toast/index.tsx';

export const Info = ({
  name,
  account,
}: {
  name: string;
  account: string | AbstractAddress;
}) => {
  const {
    fuel: { disconnect },
  } = useFuel();
  const { successToast } = useCustomToast();
  const [hover, setHover] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(account.toString());
    successToast({
      title: 'Address copied to clipboard',
    });
  };

  const icon = useMemo(() => {
    return <RoundedUserIcon width="2.4em" heigth="2.4em" />;
  }, []);

  return (
    <Menu>
      {({ isOpen, onClose }) => (
        <>
          <MenuButton
            as={Button}
            variant="ghost"
            rounded="md"
            _focus={{}}
            _hover={{}}
            _focusVisible={{}}
            _active={{}}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Box
              display="flex"
              gap={3}
              alignItems="center"
              justifyContent="flex-end"
              w="15.5rem"
              border="1px solid"
              borderColor="stroke.500"
              borderRadius="xl"
              color="white"
            >
              {hover || isOpen ? (
                <ChevronDownIcon
                  position="relative"
                  className={`rotate-base ${isOpen ? undefined : 'rotate-div'}`}
                />
              ) : null}

              {name}
              {icon}
            </Box>
          </MenuButton>
          <MenuList
            background="background.900"
            maxW={['350px', '400px']}
            w="auto"
            display="flex"
            p={2}
            flexDirection="column"
            borderColor="stroke.500"
          >
            {/* User */}
            <MenuItem
              bgColor="transparent"
              _hover={{
                cursor: 'default',
              }}
              display="flex"
              gap={4}
            >
              <Flex
                h="full"
                w="full"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Flex gap={3}>
                  <RoundedUserIcon width="3em" heigth="3em" />
                  <Flex display="flex" flexDirection="column" gap={1}>
                    <Text
                      display="flex"
                      alignItems="center"
                      gap={4}
                      fontWeight="bold"
                    >
                      {formatAddress(account.toString())}
                      <CopyIcon
                        onClick={copy}
                        _hover={{
                          cursor: 'pointer',
                          color: 'button.500',
                        }}
                      />
                    </Text>
                    <Text fontSize="sm" color="section.500">
                      Your current logged in address
                    </Text>
                  </Flex>
                </Flex>
                <Icon
                  w={5}
                  h={5}
                  as={MdClose}
                  onClick={() => onClose()}
                  _hover={{
                    cursor: 'pointer',
                    opacity: 0.8,
                  }}
                />
              </Flex>
            </MenuItem>
            <Divider w="95%" color="grey.300" mx="auto" mt={3} />

            {/* My Handles */}
            <MenuItem
              bgColor="transparent"
              color="grey.200"
              my={2}
              gap={2}
              onClick={() => {}}
              _hover={{
                cursor: 'pointer',
                color: 'button.500',
                opacity: 0.9,
              }}
            >
              <Icon as={FileIcon} />
              My Handles
            </MenuItem>
            <Divider w="95%" color="grey.300" mx="auto" />

            {/* Notifications */}
            <MenuItem
              bgColor="transparent"
              color="grey.200"
              my={2}
              gap={2}
              onClick={() => {}}
              _hover={{
                cursor: 'pointer',
                color: 'button.500',
                opacity: 0.9,
              }}
            >
              <Icon as={NotificationsIcon} />
              Notifications
            </MenuItem>
            <Divider w="95%" color="grey.300" mx="auto" />

            {/* Logout */}
            <MenuItem
              bgColor="transparent"
              color="grey.200"
              my={2}
              gap={2}
              onClick={disconnect}
              _hover={{
                cursor: 'pointer',
                color: 'button.500',
                opacity: 0.9,
              }}
            >
              <Icon as={LogoutIcon} />
              Logout
            </MenuItem>
            <Divider w="95%" color="grey.300" mx="auto" />

            <Flex
              direction="column"
              mx={3}
              mt={3}
              alignItems="flex-start"
              gap={4}
              maxW="full"
            >
              <Text color="grey.200" fontSize="xs">
                More from Bako
              </Text>
              <Flex
                w="full"
                maxW="full"
                overflowX="scroll"
                onWheel={(e) => {
                  e.preventDefault();
                  e.currentTarget.scrollLeft += e.deltaY;
                }}
                scrollBehavior="smooth"
                css={{
                  '&::-webkit-scrollbar': {
                    width: 0,
                    background: 'transparent',
                  },
                }}
              >
                <Box
                  w="130px"
                  h="130px"
                  rounded="xl"
                  _hover={{
                    cursor: 'pointer',
                    opacity: 0.8,
                  }}
                  onClick={() =>
                    window.open('https://www.bako.global', '_blank')
                  }
                  as={MoreBako}
                />
                <Box
                  w="130px"
                  h="130px"
                  rounded="xl"
                  _hover={{
                    cursor: 'pointer',
                    opacity: 0.8,
                  }}
                  as={BeginnersGuide}
                />
                <Box
                  w="130px"
                  h="130px"
                  rounded="xl"
                  _hover={{
                    cursor: 'pointer',
                    opacity: 0.8,
                  }}
                  as={MiningCrypto}
                />
                <Box
                  w="130px"
                  h="130px"
                  rounded="xl"
                  _hover={{
                    cursor: 'pointer',
                    opacity: 0.8,
                  }}
                  as={HowToSendCrypto}
                />
              </Flex>
            </Flex>

            <Divider w="95%" color="grey.300" mx="auto" mb={3} />

            <Flex
              color="grey.100"
              fontSize="xs"
              alignItems="center"
              justifyContent="center"
              gap={4}
            >
              <Text>Privacy policy</Text>
              <Box bgColor="grey.100" w={1} h={1} rounded="full" />
              <Text>Terms of use</Text>
            </Flex>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
