import { CopyIcon } from '@chakra-ui/icons';
import {
  Avatar,
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
import { useNavigate } from '@tanstack/react-router';
import type { AbstractAddress } from 'fuels';
import { useMemo } from 'react';
import { BeginnersGuide } from '../icons/beginnersGuide.tsx';
import { FileIcon } from '../icons/fileIcon.tsx';
import { HowToSendCrypto } from '../icons/howToSendCrypto.tsx';
import { LogoutIcon } from '../icons/logoutIcon.tsx';
import { MiningCrypto } from '../icons/miningCrypto.tsx';
import { MoreBako } from '../icons/moreBako.tsx';
import { SmallCloseIcon } from '../icons/smallCloseIcon.tsx';
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
  const navigate = useNavigate();
  const { successToast } = useCustomToast();

  const copy = () => {
    navigator.clipboard.writeText(account.toString());
    successToast({
      title: 'Address copied to clipboard',
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const icon = useMemo(() => {
    const path = localStorage.getItem(`@BAKO-ID/AVATAR/${account}`);
    return <Avatar borderRadius="lg" src={path!} />;
  }, []);

  return (
    <Menu strategy="fixed">
      {({ onClose }) => (
        <>
          <MenuButton
            as={Button}
            variant="ghost"
            rounded="md"
            _focus={{}}
            _hover={{}}
            _focusVisible={{}}
            _active={{}}
          >
            <Box
              display="flex"
              gap={3}
              pl={2}
              alignItems="center"
              justifyContent="flex-end"
              w={['12.5rem', '13.5rem']}
              border="1px solid"
              borderColor="stroke.500"
              borderRadius="xl"
              color="white"
            >
              <Text maxW="full" isTruncated>
                {name}
              </Text>
              {icon}
            </Box>
          </MenuButton>
          <MenuList
            background="background.900"
            maxW={['20rem', '400px']}
            w="full"
            display="flex"
            p={2}
            flexDirection="column"
            borderColor="stroke.500"
          >
            {/* User */}
            <MenuItem
              p={2}
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
                  {icon}
                  <Flex display="flex" flexDirection="column" gap={1}>
                    <Text
                      display="flex"
                      alignItems="center"
                      gap={4}
                      fontWeight="bold"
                    >
                      {name}
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
                  as={SmallCloseIcon}
                  onClick={() => onClose()}
                  _hover={{
                    cursor: 'pointer',
                    color: 'button.500',
                  }}
                />
              </Flex>
            </MenuItem>
            <Divider w="95%" color="grey.300" mx="auto" mt={3} />

            {/* My Handles */}
            <MenuItem
              p={2}
              bgColor="transparent"
              color="grey.200"
              my={2}
              gap={2}
              onClick={() => navigate({ to: '/my-handles' })}
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
            {/* <MenuItem
              p={2}
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
            <Divider w="95%" color="grey.300" mx="auto" /> */}

            {/* Logout */}
            <MenuItem
              p={2}
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
              mx={1}
              mt={3}
              alignItems="flex-start"
              gap={4}
              maxW="full"
            >
              <Text ml={1.5} color="grey.200" fontSize="xs">
                More from Bako
              </Text>
              <Flex
                w="full"
                maxW="full"
                gap={1}
                overflowX="scroll"
                onWheel={(e) => {
                  e.currentTarget.scrollLeft += e.deltaY * 0.5;
                }}
                css={{
                  '&::-webkit-scrollbar': {
                    width: 0,
                    background: 'transparent',
                  },
                }}
              >
                <Box
                  w="125px"
                  h="125px"
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
                  w="125px"
                  h="125px"
                  rounded="xl"
                  _hover={{
                    cursor: 'pointer',
                    opacity: 0.8,
                  }}
                  as={BeginnersGuide}
                />
                <Box
                  w="125px"
                  h="125px"
                  rounded="xl"
                  _hover={{
                    cursor: 'pointer',
                    opacity: 0.8,
                  }}
                  as={MiningCrypto}
                />
                <Box
                  w="125px"
                  h="125px"
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
