import { Container, Stack } from '@chakra-ui/react';
import { ProfileNfts } from './components/profileNfts';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { useListInfiniteOrdersByAddress } from '@/hooks/marketplace/useListInfiniteOrdersByAddress';
import { useMemo, useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { useWallet } from '@fuels/react';
import { ProfilePageBanner } from '../components/banner/profileBanner';
import { useResolverName } from '@/hooks';
import { formatAddress } from '@/utils/formatter';

export const ProfilePage = () => {
  const { wallet } = useWallet();

  const [fuelCollectionsPage, setFuelCollectionsPage] = useState(1);
  const owner = wallet?.address.toB256() ?? '';
  const { data: domain } = useResolverName(owner);

  const { assets } = useListAssets();

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
    <Stack direction="column" gap={0} w="full" mx="auto">
      <ProfilePageBanner
        resolver={owner}
        name={domain ?? formatAddress(owner) ?? ''}
        nftQuantity={data.length + notListedCollections.length}
        usdValue={totalUsdValue}
      />
      <Container
        maxW="1280px"
        mx="auto"
        px={0}
        py={8}
        overflowY="scroll"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0px',
          },
        }}
      >
        <Stack gap={8}>
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
    </Stack>
  );
};
