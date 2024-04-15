import {
  Box,
  BoxProps,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BsThreeDotsVertical, BsTwitterX } from 'react-icons/bs';
import { FarcasterIcon } from '..';
import { BakoSafeBanner } from '../buttons/bakoSafeBanner';
import { SidebarBanner } from '../buttons/sidebarBanner';
import { SidebarButton } from '../buttons/sidebarButton';
import { BakoSafeLogo } from '../icons/bakoSafeLogo';
import { UserIcon } from '../icons/userIcon';
import { Autocomplete } from '../inputs/autocomplete';
import { useSidebar } from './hooks/useSidebar';

interface ProfileSidebarProps extends BoxProps {}

const ProfileSidebar = (props: ProfileSidebarProps) => {
  const { isMyDomain } = useSidebar();
  const [active, setActive] = useState<string>('');

  return (
    <Box
      w="100%"
      maxW="350px"
      blur="30px"
      bgColor="gradient.100"
      p={6}
      py="auto"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      {...props}
    >
      <VStack mt={4}>
        {isMyDomain && (
          <>
            <Box w="100%" mb={6}>
              <FormControl
                display="flex"
                flexDir="column"
                alignItems="flex-start"
                justifyContent="center"
                gap={4}
              >
                <FormHelperText color="section.200" fontWeight="semibold">
                  More handles?
                </FormHelperText>
                <Autocomplete key="profile-sidebar-autocomplete" />
              </FormControl>
            </Box>
            <Divider bgColor="grey.600" w="full" />
          </>
        )}
        <SidebarButton
          setActive={setActive}
          active={active}
          title="Profile"
          icon={<UserIcon w={5} h={5} />}
        />
        {/* <SidebarButton
          setActive={setActive}
          active={active}
          title="Ownership"
          icon={<KeyIcon w={5} h={5} />}
        /> */}
        <SidebarButton
          setActive={setActive}
          active={active}
          title="More"
          icon={<BsThreeDotsVertical />}
        />
      </VStack>
      <VStack spacing={4}>
        {isMyDomain && (
          <Flex w="full" flexDirection="column" gap={2}>
            <SidebarBanner
              text="Click here to verify your X account and get benefits"
              icon={BsTwitterX}
            />

            <SidebarBanner
              text="Click here to verify your Farcaster account and get benefits"
              icon={FarcasterIcon}
              bgColor="#7F5FC7"
              iconColor="white"
            />
          </Flex>
        )}

        <BakoSafeBanner
          onClick={() => window.open('https://www.bako.global', '_blank')}
          icon={BakoSafeLogo}
        />
      </VStack>
    </Box>
  );
};

export { ProfileSidebar };
