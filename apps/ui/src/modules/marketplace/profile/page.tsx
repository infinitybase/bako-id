import { Container, Stack } from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';
import { ProfileNfts } from './components/profileNfts';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { useListInfiniteOrdersByAddress } from '@/hooks/marketplace/useListInfiniteOrdersByAddress';
import { useMemo, useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { useWallet } from '@fuels/react';
import { ProfilePageBanner } from '../components/banner/profileBanner';

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
    isFetched: isOrdersFetched,
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
    isFetched: isCollectionsFetched,
  } = useCollections({
    address: owner,
    page: fuelCollectionsPage,
  });

  return (
    <Container
      maxW="1280px"
      py={8}
      overflowY="scroll"
      sx={{
        '&::-webkit-scrollbar': {
          width: '0px',
        },
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
          isLoadingCollections={!isCollectionsFetched || isLoadingCollections}
          isLoadingOrders={!isOrdersFetched || isLoadingOrders}
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
