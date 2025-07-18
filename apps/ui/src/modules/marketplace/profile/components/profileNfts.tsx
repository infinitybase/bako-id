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
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useProfileNftLoader } from '../../hooks/useProfileNftLoader';
import NftSaleCard from '@/modules/profile/components/nft/NftSaleCard';
import { NftCollectionCard } from '@/modules/profile/components/nft/NftCollectionCard';
import { MartketplaceEmptyState } from '../../components/martketplaceEmptyState';
import type { AssetMetadata } from '@/utils/getOrderMetadata';
import type { Order } from '@/types/marketplace';
import type { NFTCollection } from '@/utils/collection';
import { useWallet } from '@fuels/react';
import { useResolverName } from '@/hooks';
import { BAKO_CONTRACTS_IDS } from '@/utils/constants';

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
  orders: Order[];
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
  const { wallet } = useWallet();
  const ownerDomain = wallet?.address.b256Address;

  const { data: hasDomain } = useResolverName(resolver);

  const isOwner = useMemo(
    () => ownerDomain === resolver,
    [ownerDomain, resolver]
  );

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

  const notListedCollectionsWithoutHandles = notListedCollections.filter(
    (collection) =>
      !BAKO_CONTRACTS_IDS.includes(collection.assets[0]?.contractId ?? '')
  );

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
                    bg: '#00DB7D1A',
                    color: 'button.800',
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

        {notListedCollectionsWithoutHandles?.map((collection) => (
          <Box key={collection.name} mb={6}>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(6, 1fr)',
              }}
              gap={6}
              maxH="245px"
            >
              {collection.assets.map((a) => (
                <NftCollectionCard
                  key={a.assetId}
                  asset={a}
                  assets={assets}
                  resolver={resolver}
                  isOwner={isOwner}
                  ctaButtonVariant="mktPrimary"
                  nftCardMinSize="175px"
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
          maxH="245px"
        >
          {orders?.map((order) => (
            <GridItem key={order.id}>
              <NftSaleCard
                order={order}
                showDelistButton={false}
                isOwner={isOwner}
                showBuyButton={false}
                withHandle={!!hasDomain}
                imageSize="full"
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
