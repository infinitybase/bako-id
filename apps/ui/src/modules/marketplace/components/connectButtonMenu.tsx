import accoutIcon from '@/assets/account-icon.svg';
import { LogoutIcon, UserIcon, useCustomToast } from '@/components';
import { SmallCloseIcon } from '@/components/icons/smallCloseIcon';
import { TermsOfUseDialog } from '@/components/termsOfUseDialog';
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
import type { Address } from 'fuels';
import { useState } from 'react';

export const ConnectButtonMenu = ({
  name,
  account,
}: {
  name: string;
  account: string | Address;
}) => {
  const {
    fuel: { disconnect },
  } = useFuel();
  const navigate = useNavigate();
  const { successToast } = useCustomToast();
  const [showTerms, setShowTerms] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(account.toString());
    successToast({
      title: 'Address copied to clipboard',
    });
  };

  const onOpenMenu = () => {
    document.body.style.overflow = 'hidden';
  };
  const onCloseMenu = () => {
    document.body.style.overflow = 'auto';
  };

  const handleLogout = async () => {
    await disconnect();
    navigate({ to: '/' });
  };

  const handleRedirect = () => {
    navigate({
      to: '/profile/$name',
      params: { name },
    });
  };
  const icon = (
    <Box
      bg="linear-gradient(132.19deg, #FFC010 0%, #EBA312 48%, #D38015 71%, #B24F18 99%)"
      p="1px"
      rounded="lg"
    >
      <Avatar
        borderRadius="lg"
        src={accoutIcon}
        objectFit="fill"
        h="full"
        borderColor="black"
        borderWidth={3}
        p={0.5}
      />
    </Box>
  );

  return (
    <>
      <TermsOfUseDialog showTerms={showTerms} setShowTerms={setShowTerms} />
      <Menu strategy="fixed" onOpen={onOpenMenu} onClose={onCloseMenu}>
        {({ onClose }) => (
          <>
            <MenuButton
              as={Button}
              variant="ghost"
              rounded="md"
              minW="fit-content"
              _focus={{}}
              _hover={{}}
              _focusVisible={{}}
              _active={{}}
              pl={0}
            >
              <Box
                display="flex"
                gap={3}
                pl={2}
                alignItems="center"
                justifyContent="space-between"
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
              mr={4}
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
                          transform={'scaleX(-1)'}
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

              {/* Profile */}
              <MenuItem
                p={2}
                bgColor="transparent"
                color="grey.200"
                gap={2}
                mt={2}
                onClick={handleRedirect}
                _hover={{
                  cursor: 'pointer',
                  color: 'button.500',
                  opacity: 0.9,
                }}
              >
                <Icon as={UserIcon} />
                Profile
              </MenuItem>
              <Divider w="95%" color="grey.300" mx="auto" mt={3} />

              {/* Logout */}
              <MenuItem
                p={2}
                bgColor="transparent"
                color="grey.200"
                my={2}
                gap={2}
                onClick={handleLogout}
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
                color="grey.100"
                fontSize="xs"
                alignItems="center"
                justifyContent="center"
                gap={4}
                as={Button}
                bg="transparent"
                p={0}
                _hover={{ bg: 'none' }}
                size="xs"
                onClick={() => setShowTerms(true)}
              >
                <Text>Privacy policy</Text>
                <Box bgColor="grey.100" w={1} h={1} rounded="full" />
                <Text>Terms of use</Text>
              </Flex>
            </MenuList>
          </>
        )}
      </Menu>
    </>
  );
};
