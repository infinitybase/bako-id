import { Container, Stack } from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';
import { ProfilePageBanner } from '../components/banner/profilePageBanner';
import { ProfileNfts } from './components/profileNfts';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { useListInfiniteOrdersByAddress } from '@/hooks/marketplace/useListInfiniteOrdersByAddress';
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
  } = useListInfiniteOrdersByAddress({
    page: 0,
    sellerAddress: owner.toLowerCase(),
  });

  const totalUsdValue =
    (orders?.pages?.[0]?.totalOrdersUsdPrice ?? 0) +
    (orders?.pages?.[0]?.notListedTotalUsdPrice ?? 0);

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
          resolver={owner}
          name={name}
          nftQuantity={data.length + notListedCollections.length}
          usdValue={totalUsdValue}
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
