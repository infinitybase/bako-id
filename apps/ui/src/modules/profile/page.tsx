import { Box, Flex, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AccountsCard } from '../../components/card/accountsCard';
import { AddressesCard } from '../../components/card/addressesCard';
import { OwnershipCard } from '../../components/card/ownershipCard';
import { ProfileCard } from '../../components/card/profileCard';
import { ProfileDrawer } from '../../components/drawer/profile';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useProfile } from './hooks/useProfile';

const Profile = () => {
  const { domain, domainParam, owner } = useProfile();
  const { isMobile } = useScreenSize();
  const drawer = useDisclosure();

  return (
    <>
      <ProfileDrawer isOpen={drawer.isOpen} onClose={() => drawer.onClose()} />

      <Box
        w="full"
        h="full"
        maxH={['100vh', '100vh']}
        position="relative"
        display="flex"
        flexDirection={['column', 'column', 'column', 'row']}
        gap={[4, 4, 4, 6]}
      >
        {isMobile && (
          <Flex
            onClick={() => drawer.onOpen()}
            alignItems="center"
            my={3}
            gap={2}
          >
            <BsThreeDotsVertical width={6} height={6} />
            <Text>Menu</Text>
          </Flex>
        )}
        <Stack
          display="flex"
          h="fit-content"
          spacing={6}
          direction={['column', 'column', 'column', 'row']}
          w="full"
        >
          <Flex w="full" h="full" flexDirection="column" gap={[4, 4, 4, 6]}>
            <ProfileCard domainName={domainParam} domain={domain ?? ''} />
            <Stack
              w="full"
              h="full"
              direction={['column', 'column', 'column', 'row']}
              gap={[4, 4, 4, 6]}
            >
              <OwnershipCard owner={owner ?? ''} />
              <AddressesCard domain={domain ?? ''} />
            </Stack>
          </Flex>
          <AccountsCard />
        </Stack>
      </Box>
    </>
  );
};

export { Profile };
