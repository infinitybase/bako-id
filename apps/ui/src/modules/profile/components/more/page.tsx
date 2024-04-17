import { Box, Center, useDisclosure } from '@chakra-ui/react';
import { ResolverCard } from '../../../../components/card/more/resolverCard';
import { TokenCard } from '../../../../components/card/more/tokenCard';
import { ValidityCard } from '../../../../components/card/more/validityCard';
import { ProfileDrawer } from '../../../../components/drawer/profile';

const More = () => {
  const drawer = useDisclosure();

  return (
    <>
      <ProfileDrawer isOpen={drawer.isOpen} onClose={() => drawer.onClose()} />

      <Center
        w="full"
        h="full"
        overflowY="scroll"
        sx={{
          '&::-webkit-scrollbar': {
            width: '5px',
            maxHeight: '330px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#2C2C2C',
            borderRadius: '30px',
          },
        }}
      >
        <Box
          w={['full', '90%', '90%', '65%']}
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
    </>
  );
};

export { More };
