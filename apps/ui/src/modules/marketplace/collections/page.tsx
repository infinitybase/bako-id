import {
  Container,
  Divider,
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
import { slugify } from '@/utils/slugify';

export const CollectionPage = () => {
  const navigate = useNavigate();
  const { collectionName } = useParams({ strict: false });
  const slugifiedCollectionName = slugify(collectionName);
  const { search } = useSearch({ strict: false });
  const debouncedSearch = useDebounce<string>(search?.trim() ?? '', 700);
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
    collectionId: slugifiedCollectionName,
    sortValue: filters.sortBy,
    sortDirection: filters.sortDirection,
    limit: collectionOrdersLimit,
    search: debouncedSearch,
  });

  const { collection } = useGetCollection({
    collectionId: slugifiedCollectionName,
  });

  const {
    maxSupply,
    totalMinted,
    mintPrice,
    asset,
    isLoading: isLoadingMintData,
    isFetched: isFetchedMintData,
  } = useGetMintData(
    collection?.data?.id ?? '',
    collection?.data?.isMintable ?? false
  );

  const wasAllSupplyMinted =
    Number(maxSupply) > 0 && Number(maxSupply) === Number(totalMinted);

  const isMintable =
    Number(maxSupply) > 0 && Number(totalMinted) < Number(maxSupply);

  const showMintTab = !isLoadingMintData && (isMintable || wasAllSupplyMinted);

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

  // Reset scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (collection?.data === null) {
      navigate({
        to: '/',
      });
    }
  }, [collection?.data, navigate]);

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
        <Tabs variant="soft-rounded">
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
            {showMintTab && (
              <Tab
                _selected={{ bg: 'grey.600', color: 'white' }}
                color="disabled.500"
                bg="input.600"
                borderRadius="8px 8px 0 0"
                fontSize="xs"
                letterSpacing=".5px"
              >
                {wasAllSupplyMinted ? 'About' : 'Mint'}
              </Tab>
            )}
          </TabList>
          <Divider my={0} py={0} borderColor="grey.600" />
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

            {showMintTab && (
              <TabPanel p={0}>
                <MintPanel
                  collectionName={slugifiedCollectionName ?? ''}
                  collectionId={collection?.data?.id ?? ''}
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
        <Outlet />
      </Container>
    </Stack>
  );
};
