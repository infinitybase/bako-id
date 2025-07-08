import { Card } from '@/components';
import {
  Flex,
  Heading,
  Tab,
  Tabs,
  TabList,
  GridItem,
  Box,
  Grid,
  Skeleton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useProfileNftLoader } from '../hooks/useProfileNftLoader';
import NftSaleCard from '@/modules/profile/components/nft/NftSaleCard';
import { NftCollectionCard } from '@/modules/profile/components/nft/NftCollectionCard';
import { MartketplaceEmptyState } from './martketplaceEmptyState';
import type { AssetMetadata } from '@/utils/getOrderMetadata';
import type { OrdersList } from '@/types/marketplace';
import type { NFTCollection } from '@/utils/collection';

enum TabOptions {
  FOR_SALE = 'for_sale',
  NOT_LISTED = 'not_listed',
  ALL = 'all',
}
const tabOptions = [
  { value: TabOptions.FOR_SALE, label: 'For sale' },
  { value: TabOptions.NOT_LISTED, label: 'Not listed' },
  { value: TabOptions.ALL, label: 'All' },
];

type ProfileNftProps = {
  assets: {
    metadata: AssetMetadata;
    id: string;
    fees: [string, string];
    __typename: 'Asset';
  }[];
  orders: OrdersList[];
  notListedCollections: NFTCollection[];
  isLoadingCollections: boolean;
  isLoadingOrders: boolean;
  isPlaceholderData: boolean;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  setFuelCollectionsPage: (page: number) => void;
  resolver: string;
};

export const ProfileNfts = ({
  assets,
  orders,
  notListedCollections,
  isLoadingCollections,
  isLoadingOrders,
  isPlaceholderData,
  currentPage,
  totalPages,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  setFuelCollectionsPage,
  resolver,
}: ProfileNftProps) => {
  const [selectedTab, setSelectedTab] = useState(TabOptions.ALL);

  const { ref, inView } = useInView();

  const {
    startCollectionsLoading,
    startOrdersLoading,
    isEmptyCollections,
    isEmptyOrders,
  } = useProfileNftLoader({
    isLoadingCollections,
    notListedCollections,
    data: orders,
    isLoadingOrders,
    isPlaceholderData,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Make sure to fetch next page of collections when we have done fetching all orders
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    } else if (currentPage && totalPages > currentPage) {
      setFuelCollectionsPage(currentPage + 1);
    }

    // Make sure to fetch next page of collections if only the collections are visible (not_listed)
    if (
      selectedTab === TabOptions.NOT_LISTED &&
      currentPage &&
      totalPages > currentPage
    ) {
      setFuelCollectionsPage(currentPage + 1);
    }
  }, [
    inView,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    currentPage,
    totalPages,
    selectedTab,
  ]);

  if (startCollectionsLoading || startOrdersLoading) {
    return (
      <Card>
        <Flex mb={6} alignItems="center" justify="space-between">
          <Skeleton w="100px" h="20px" />
          <Flex>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                w="60px"
                h="25px"
                py={2}
                mx={1}
                rounded="md"
              />
            ))}
          </Flex>
        </Flex>
        <SkeletonCardsLoading />
      </Card>
    );
  }

  return (
    <Card
      w="full"
      h={['fit-content', 'fit-content', 'fit-content', 'auto']}
      display="flex"
      backdropFilter="blur(6px)"
      flexDirection="column"
      boxShadow="lg"
    >
      <Flex mb={6} alignItems="center" justify="space-between">
        <Heading fontSize="14px">NFT's</Heading>
        <Tabs variant="unstyled" defaultValue={TabOptions.ALL} defaultIndex={2}>
          <TabList>
            {tabOptions.map((tab) => (
              <Tab
                onClick={() => setSelectedTab(tab.value)}
                key={tab.value}
                value={tab.value}
                sx={{
                  borderRadius: '8px',
                  bg: '#F5F5F50D',
                  color: 'gray.100',
                  py: '6px',
                  px: '8px',
                  mx: 1,
                  letterSpacing: '0.5px',
                  fontSize: '12px',
                  fontWeight: '400',
                  _selected: {
                    bg: '#FFC0101A',
                    color: 'yellow-light',
                  },
                }}
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Flex>

      {selectedTab === TabOptions.ALL &&
        isEmptyCollections &&
        isEmptyOrders && <MartketplaceEmptyState />}

      {/* NOT LISTED TAB */}
      <Box
        display={
          selectedTab === TabOptions.NOT_LISTED ||
          selectedTab === TabOptions.ALL
            ? 'block'
            : 'none'
        }
      >
        {selectedTab === TabOptions.NOT_LISTED && isEmptyCollections && (
          <MartketplaceEmptyState />
        )}

        {notListedCollections?.map((collection) => (
          <Box key={collection.name} mb={5}>
            <Heading fontSize="md" mb={3}>
              {collection.name}
            </Heading>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(6, 1fr)',
              }}
              gap={6}
            >
              {collection.assets.map((a) => (
                <NftCollectionCard
                  key={a.assetId}
                  asset={a}
                  assets={assets}
                  resolver={resolver}
                />
              ))}
            </Grid>
          </Box>
        ))}
      </Box>

      {/* FOR SALE TAB */}
      <Box
        display={
          selectedTab === TabOptions.FOR_SALE || selectedTab === TabOptions.ALL
            ? 'block'
            : 'none'
        }
      >
        {selectedTab === TabOptions.FOR_SALE && isEmptyOrders && (
          <MartketplaceEmptyState />
        )}

        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(6, 1fr)',
          }}
          gap={6}
        >
          {orders?.map((order) => (
            <GridItem key={order.id}>
              <NftSaleCard
                order={order}
                showDelistButton={false}
                isOwner={true}
                showBuyButton={false}
                withHandle={false}
              />
            </GridItem>
          ))}
        </Grid>
      </Box>

      <Box ref={ref} h="10px" w="full" />
    </Card>
  );
};

const SkeletonCardsLoading = () => {
  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
        lg: 'repeat(6, 1fr)',
      }}
      gap={6}
      overflow="hidden"
      mb={5}
    >
      {new Array(12).fill(null).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <GridItem key={index}>
          <Skeleton w="full" minW={160} h={230} rounded="lg" />
        </GridItem>
      ))}
    </Grid>
  );
};
