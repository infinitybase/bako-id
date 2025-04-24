import {
  Box,
  Divider,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  VStack,
  type DrawerProps,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
// import { FarcasterIcon } from '..';
import { BakoSafeBanner } from '../buttons/bakoSafeBanner';
// import { SidebarBanner } from '../buttons/sidebarBanner';
import { SidebarButton } from '../buttons/sidebarButton';
import { BakoSafeLogo } from '../icons/bakoSafeLogo';
import { UserIcon } from '../icons/userIcon';
import { Autocomplete } from '../inputs/autocomplete';

interface ProfileDrawerProps extends Omit<DrawerProps, 'children'> {}

const ProfileDrawer = ({ ...props }: ProfileDrawerProps) => {
  const [active, setActive] = useState<string>('');

  return (
    <Drawer
      isFullHeight
      {...props}
      size="full"
      variant="glassmorphic"
      placement="left"
      onClose={props.onClose}
    >
      <DrawerOverlay />
      <DrawerContent
        w="full"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <DrawerCloseButton onClick={props.onClose} />
        <VStack mt={4}>
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
              <Autocomplete
                key="profile-sidebar-autocomplete"
                actionOnContinue={props.onClose}
              />
            </FormControl>
          </Box>
          <Divider bgColor="grey.600" w="full" zIndex={1} />

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
          {/* {isMyDomain && (
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
          )} */}

          <BakoSafeBanner icon={BakoSafeLogo} />
        </VStack>
      </DrawerContent>
    </Drawer>
  );
};

export { ProfileDrawer };
