import { ProfileDrawer } from '@/components';
import { useScreenSize } from '@/hooks';
import type { Order } from '@/types/marketplace';
import type { PaginationResult } from '@/utils/pagination';
import { Box, Center, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ProfileCards } from './profileCards';

export default function ProfileWithHandler({
  domain,
  domainParam,
  owner,
  orders,
  isFetchingOrders,
}: {
  domain: string;
  domainParam: string;
  owner: string;
  orders: PaginationResult<Order> | undefined;
  isFetchingOrders: boolean;
}) {
  const { isMobile } = useScreenSize();
  const drawer = useDisclosure();

  return (
    <>
      <ProfileDrawer isOpen={drawer.isOpen} onClose={() => drawer.onClose()} />

      <Flex
        w="full"
        justifyContent="center"
        pr={['0', '0', '0', '0', '0', '10%']}
      >
        <Box
          maxW={1080}
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
              gap={6}
            >
              <ProfileCards
                domain={domain}
                domainParam={domainParam}
                owner={owner}
                orders={orders}
                withHandle
                isFetchingOrders={isFetchingOrders}
              />
            </Box>
          </Center>
        </Box>
      </Flex>
    </>
  );
}
