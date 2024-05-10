import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ProfileDrawer } from '../../components/drawer/profile';
import { useScreenSize } from '../../hooks/useScreenSize';
import { ProfileCards } from './components/profileLoader';
import { useProfile } from './hooks/useProfile';

const Profile = () => {
  const { domain, domainParam, isLoadingDomain, owner } = useProfile();
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

        <ProfileCards
          domain={domain ?? ''}
          domainParam={domainParam}
          isLoading={isLoadingDomain}
          owner={owner ?? ''}
        />
      </Box>
    </>
  );
};

export { Profile };
