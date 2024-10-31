import { Box, Center, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ProfileDrawer } from '../../components/drawer/profile';
import { useScreenSize } from '../../hooks/useScreenSize';
import { ProfileCards } from './components/profileCards';
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
        <Center
          w="full"
          h="full"
          overflowY="scroll"
          sx={{
            '&::-webkit-scrollbar': {
              width: '0px',
              maxHeight: '330px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2C2C2C',
              borderRadius: '30px',
            },
          }}
        >
          <Box
            w={['full', 'full', 'full', 'full']}
            h="full"
            maxH={['80vh', '80vh', '75vh', '80vh']}
            display="flex"
            flexDirection="column"
            gap={12}
          >
            <ProfileCards
              domain={domain ?? ''}
              domainParam={domainParam}
              isLoading={isLoadingDomain}
              owner={owner ?? ''}
            />
          </Box>
        </Center>
      </Box>
    </>
  );
};

export { Profile };
