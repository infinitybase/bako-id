import {
  Box,
  Container,
  Divider,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { OrderList } from '../components/orderList';

import { useGetCollection } from '@/hooks/marketplace/useGetCollection';
import { useGetCollectionOrders } from '@/hooks/marketplace/useGetCollectionOrders';
import { useGetMintData } from '@/hooks/marketplace/useGetMintData';
import { useDebounce } from '@/hooks/useDebounce';
import { CollectionPageBanner } from '../components/banner/collectionBanner';
import MarketplaceFilter from '../components/marketplaceFilter';
import MintPanel from '../components/mintPanel';
import { useProcessingOrdersStore } from '../stores/processingOrdersStore';

export const CollectionPage = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams({ strict: false });
  const { search } = useSearch({ strict: false });
  const debouncedSearch = useDebounce<string>(search?.trim() ?? '', 700);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [filters, setFilters] = useState<{
    sortBy: string;
    sortDirection: 'desc' | 'asc';
  }>({
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });
  const { purchasedOrders } = useProcessingOrdersStore();

  const collectionOrdersLimit = 10;

  const {
    collectionOrders,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
    isPlaceholderData,
  } = useGetCollectionOrders({
    collectionId,
    sortValue: filters.sortBy,
    sortDirection: filters.sortDirection,
    limit: collectionOrdersLimit,
    search: debouncedSearch,
  });

  const { collection } = useGetCollection({
    collectionId,
  });

  const {
    maxSupply,
    totalMinted,
    mintPrice,
    asset,
    isLoading: isLoadingMintData,
    isFetched: isFetchedMintData,
  } = useGetMintData(collectionId, collection?.data?.isMintable ?? false);

  const wasAllSupplyMinted =
    Number(maxSupply) > 0 && Number(maxSupply) === Number(totalMinted);

  const isCollectionStillMintable =
    Number(maxSupply) > 0 && Number(totalMinted) < Number(maxSupply);

  const shouldShowMintTab =
    !isLoadingMintData && (isCollectionStillMintable || wasAllSupplyMinted);

  const handleChangeSearch = useCallback(
    (search: string) => {
      navigate({
        search: {
          // @ts-expect-error - TODO: add type for search in router schema
          search,
        },
      });
    },
    [navigate]
  );

  const handleSortChange = (column: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column.replace('-asc', '').replace('-desc', ''),
      sortDirection: column.includes('asc') ? 'asc' : 'desc',
    }));
  };

  const data = useMemo(() => {
    // Remove the orders that were purchased from the list
    return (collectionOrders?.pages?.flatMap((page) => page.data) ?? []).filter(
      (order) =>
        !purchasedOrders.some(
          (purchasedOrder) => purchasedOrder.orderId === order.id
        )
    );
  }, [collectionOrders, purchasedOrders]);

  const hasItems = data.length > 0 || debouncedSearch;
  const shouldDefaultToMintTab =
    isFetched &&
    !isLoadingMintData &&
    collection?.data?.isMintable &&
    isCollectionStillMintable;

  const renderSkeletonTab =
    collection?.data?.isMintable && (!isFetched || isLoadingMintData);

  // Reset scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (shouldDefaultToMintTab) {
      if (shouldShowMintTab && hasItems) {
        setActiveTabIndex(1);
      } else if (!shouldShowMintTab) {
        setActiveTabIndex(0);
      }
    }
  }, [hasItems, shouldShowMintTab, shouldDefaultToMintTab]);

  return (
    <Stack w="full" p={0} m={0}>
      <CollectionPageBanner collection={collection?.data!} />

      <Container
        maxW="1280px"
        px={{ base: '16px', sm: '22px' }}
        py={8}
        overflowY="hidden"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0px',
          },
        }}
        minH="100vh"
        pb={{
          base: 15,
          sm: 8,
        }}
      >
        {renderSkeletonTab ? (
          <TabSkeleton />
        ) : (
          <Tabs
            variant="soft-rounded"
            index={activeTabIndex}
            onChange={setActiveTabIndex}
          >
            <TabList>
              {(data.length > 0 || debouncedSearch) && (
                <Tab
                  _selected={{
                    bg: 'grey.600',
                    color: 'white',
                  }}
                  color="disabled.500"
                  bg="input.600"
                  borderRadius="8px 8px 0 0"
                  fontSize="xs"
                  letterSpacing=".5px"
                >
                  Items
                </Tab>
              )}
              {shouldShowMintTab && (
                <Tab
                  _selected={{ bg: 'garage.100', color: 'black' }}
                  color="black"
                  bg="#63930f"
                  borderRadius="8px 8px 0 0"
                  fontSize="xs"
                  letterSpacing=".5px"
                >
                  {wasAllSupplyMinted ? 'About' : 'Mint'}
                </Tab>
              )}
            </TabList>

            {isFetched && <Divider my={0} py={0} borderColor="grey.600" />}
            <TabPanels>
              {(data.length > 0 || debouncedSearch) && (
                <TabPanel px={0}>
                  <Stack gap={8}>
                    <MarketplaceFilter
                      searchValue={search}
                      onSearchChange={handleChangeSearch}
                      sortValue={filters.sortBy}
                      onSortChange={handleSortChange}
                      isCollectionPage
                    />
                    <OrderList
                      orders={data}
                      hasNextPage={hasNextPage}
                      onFetchNextPage={fetchNextPage}
                      isLoadingOrders={!isFetched || isLoading}
                      isFetchingNextPage={isFetchingNextPage}
                      collectionOrdersLimit={collectionOrdersLimit}
                      isPlaceholderData={isPlaceholderData}
                    />
                  </Stack>
                </TabPanel>
              )}

              {shouldShowMintTab && (
                <TabPanel p={0}>
                  <MintPanel
                    collectionName={collection?.data?.name ?? ''}
                    collectionId={collectionId ?? ''}
                    maxSupply={maxSupply}
                    totalMinted={totalMinted}
                    mintPrice={mintPrice}
                    config={collection?.data?.config}
                    asset={asset}
                    isLoading={isLoadingMintData || !isFetchedMintData}
                    wasAllSupplyMinted={wasAllSupplyMinted}
                  />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        )}
        <Outlet />
      </Container>
    </Stack>
  );
};

const TabSkeleton = () => (
  <Stack spacing={0} w="full">
    <Stack direction="row" spacing={0} h="33px">
      <Skeleton
        bg="input.600"
        borderRadius="8px 8px 0 0"
        p="8px 16px"
        h="100%"
        w="66px"
      />

      <Box
        bg="#63930f"
        borderRadius="8px 8px 0 0"
        p="8px 16px"
        h="100%"
        w="56px"
        sx={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.5,
            },
          },
        }}
      />
    </Stack>

    <Divider mb={6} py={0} borderColor="grey.600" />
  </Stack>
);
