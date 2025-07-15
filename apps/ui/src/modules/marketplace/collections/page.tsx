import { Container, Stack } from '@chakra-ui/react';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { OrderList } from '../components/orderList';

import MarketplaceFilter from '../components/marketplaceFilter';
import { useGetCollection } from '@/hooks/marketplace/useGetCollection';
import { useGetCollectionOrders } from '@/hooks/marketplace/useGetCollectionOrders';
import { useDebounce } from '@/hooks/useDebounce';
import { CollectionPageBanner } from '../components/banner/collectionPageBanner';

export const CollectionPage = () => {
  const collectionOrdersLimit = 10;
  const { collectionId } = useParams({ strict: false });
  const { search } = useSearch({ strict: false });
  const debouncedSearch = useDebounce<string>(search ?? '', 700);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    sortBy: string;
    sortDirection: 'desc' | 'asc';
  }>({
    sortBy: 'volumes',
    sortDirection: 'desc',
  });

  const {
    collectionOrders,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useGetCollectionOrders({
    collectionId,
    sortValue: filters.sortBy,
    sortDirection: filters.sortDirection,
    limit: collectionOrdersLimit,
    search: debouncedSearch,
  });

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

  const { collection } = useGetCollection({
    collectionId,
  });

  const data = useMemo(
    () => collectionOrders?.pages?.flatMap((page) => page.data) ?? [],
    [collectionOrders]
  );

  console.log('isFetched', isFetched);

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
        <CollectionPageBanner collection={collection?.data!} />

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
        />
      </Stack>
      <Outlet />
    </Container>
  );
};
