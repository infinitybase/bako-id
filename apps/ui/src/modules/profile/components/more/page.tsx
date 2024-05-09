import { Box, Center, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ResolverCard } from '../../../../components/card/more/resolverCard';
import { TokenCard } from '../../../../components/card/more/tokenCard';
import { ValidityCard } from '../../../../components/card/more/validityCard';
import { ProfileDrawer } from '../../../../components/drawer/profile';
import { useScreenSize } from '../../../../hooks/useScreenSize';

const More = () => {
  const drawer = useDisclosure();
  const { isMobile } = useScreenSize();

  return (
    <>
      <ProfileDrawer isOpen={drawer.isOpen} onClose={() => drawer.onClose()} />
      <Box
        w="full"
        h="full"
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
            ml={[0, 6, 6, 6]}
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
            w={['full', 'auto', 'full', 'auto']}
            h="full"
            maxH={['80vh', '80vh', '75vh', '80vh']}
            display="flex"
            flexDirection="column"
            gap={12}
          >
            <TokenCard />
            <ValidityCard />
            <ResolverCard />
          </Box>
        </Center>
      </Box>
    </>
  );
};

export { More };
