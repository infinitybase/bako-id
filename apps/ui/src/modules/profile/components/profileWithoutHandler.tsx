import type { Order } from '@/types/marketplace';
import type { PaginationResult } from '@/utils/pagination';
import { Container, Stack } from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';
import { NftCollections } from './nft/NftCollections';
import { NftListForSale } from './nft/NftListForSale';
import ProfileHandleBanner from './profileHandleBanner';

export default function ProfileWithoutHandler({
  orders,
  isLoadingOrders = false,
}: {
  orders: PaginationResult<Order> | undefined;
  isLoadingOrders?: boolean;
}) {
  const { domain: domainParam } = useParams({ strict: false });

  const address = domainParam.toLowerCase();

  return (
    <Container
      maxWidth="container.xl"
      pt={8}
      pb={20}
      overflowY="scroll"
      display="flex"
      flexDirection="column"
      sx={{
        '&::-webkit-scrollbar': {
          width: '0px',
        },
      }}
      maxH="100vh"
    >
      <Stack w="full" height="full" flex={1} gap={6} pb={10}>
        <ProfileHandleBanner />

        <NftListForSale
          address={address}
          orders={orders}
          isLoadingOrders={isLoadingOrders}
        />

        <NftCollections resolver={address} />
      </Stack>
    </Container>
  );
}
