import {
  Container,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from '@chakra-ui/react';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { OrderList } from '../components/orderList';

import MarketplaceFilter from '../components/marketplaceFilter';
import { useGetCollection } from '@/hooks/marketplace/useGetCollection';
import { useGetCollectionOrders } from '@/hooks/marketplace/useGetCollectionOrders';
import { useDebounce } from '@/hooks/useDebounce';
import { CollectionPageBanner } from '../components/banner/collectionBanner';
import MintPanel from '../components/mintPanel';
import { useGetMintData } from '@/hooks/marketplace/useGetMintData';

export const CollectionPage = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams({ strict: false });
  const { search } = useSearch({ strict: false });
  const debouncedSearch = useDebounce<string>(search ?? '', 700);
  const [filters, setFilters] = useState<{
    sortBy: string;
    sortDirection: 'desc' | 'asc';
  }>({
    sortBy: 'volumes',
    sortDirection: 'desc',
  });

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

  const isMintable =
    Number(maxSupply) > 0 && Number(totalMinted) < Number(maxSupply);

  const wasAllSupplyMinted = Number(maxSupply) === Number(totalMinted);

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

  const data = useMemo(
    () => collectionOrders?.pages?.flatMap((page) => page.data) ?? [],
    [collectionOrders]
  );

  // Reset scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Stack w="full" p={0} m={0}>
      <CollectionPageBanner collection={collection?.data!} />

      <Container
        maxW="1280px"
        px={0}
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
            {data.length > 0 && (
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
            {!isLoadingMintData && isMintable && (
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
            {data.length > 0 && (
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
          </TabPanels>
        </Tabs>
        <Outlet />
      </Container>
    </Stack>
  );
};
