import { Container, Stack } from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';
import { ProfilePageBanner } from './banner/profilePageBanner';
import { ProfileNfts } from './profileNfts';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { useListOrdersByAddress } from '@/hooks/marketplace/useListOrdersByAddress';
import { useMemo, useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { useWallet } from '@fuels/react';

export const ProfilePage = () => {
  const { wallet } = useWallet();

  const { name } = useParams({ strict: false });
  const [fuelCollectionsPage, setFuelCollectionsPage] = useState(1);

  const { assets } = useListAssets();

  const owner = wallet?.address.toB256() ?? '';
  const {
    orders,
    isLoading: isLoadingOrders,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListOrdersByAddress({
    sellerAddress: owner.toLowerCase(),
  });
  const data = useMemo(
    () => orders?.pages?.flatMap((page) => page.data) ?? [],
    [orders]
  );
  const {
    collections: notListedCollections,
    isLoading: isLoadingCollections,
    totalPages,
    isPlaceholderData,
    currentPage,
  } = useCollections({
    address: owner,
    page: fuelCollectionsPage,
  });

  return (
    <Container
      maxWidth="container.xl"
      py={8}
      overflowY="scroll"
      sx={{
        '&::-webkit-scrollbar': {
          width: '0px',
        },
      }}
      maxH="100vh"
      pb={{
        base: 15,
        sm: 8,
      }}
    >
      <Stack gap={8}>
        <ProfilePageBanner
          name={name}
          nftQuantity={data.length + notListedCollections.length}
          // TODO: Create the new endpoint to sum this total
          usdValue={0}
        />

        <ProfileNfts
          assets={assets}
          orders={data}
          notListedCollections={notListedCollections}
          isLoadingCollections={isLoadingCollections}
          isLoadingOrders={isLoadingOrders}
          isPlaceholderData={isPlaceholderData}
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          setFuelCollectionsPage={setFuelCollectionsPage}
          resolver={owner}
        />
      </Stack>
    </Container>
  );
};
