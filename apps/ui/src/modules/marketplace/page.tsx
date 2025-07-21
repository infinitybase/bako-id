import { useDebounce } from '@/hooks/useDebounce';
import { Box, Container, Stack } from '@chakra-ui/react';
import { Outlet, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SearchBar, MarketplacePageSkeleton } from './components';
import { CollectionList } from './components/collectionList';

import { useGetCollections } from '@/hooks/marketplace/useListCollections';
import type { Collection } from '@/types/marketplace';
import { useInView } from 'react-intersection-observer';
import { MarketplaceBanner } from './components/banner/collectionsBanner';

export const MarketplacePage = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const [initialBanners, setInitialBanners] = useState<Collection[]>([]);
  const [sortValue, setSortValue] = useState('volumes');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { search } = useSearch({ strict: false });
  const debouncedSearch = useDebounce<string>(search ?? '', 700);

  const {
    collections,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useGetCollections({
    limit: 10,
    search: debouncedSearch,
    sortValue,
    sortDirection,
  });

  const data = useMemo(
    () => collections?.pages?.flatMap((page) => page.data) ?? [],
    [collections]
  );

  useEffect(() => {
    if (data.length > 0 && !initialBanners.length) {
      setInitialBanners(data.slice(0, 3));
    }
  }, [data, initialBanners]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

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
    if (sortValue === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortValue(column);
      setSortDirection('asc');
    }
  };

  if (!isFetched && isLoading && data.length === 0) {
    return <MarketplacePageSkeleton />;
  }

  return (
    <Stack w="full" p={0} m={0}>
      <MarketplaceBanner collections={initialBanners} />
      <Container
        maxWidth="1920px"
        py={8}
        overflowY="hidden"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0px',
          },
        }}
        pb={{
          base: 15,
          sm: 8,
        }}
      >
        <Stack gap={10}>
          <SearchBar
            value={search}
            onChange={handleChangeSearch}
            placeholder="Search by collection name"
          />

          <CollectionList
            collections={data}
            sortValue={sortValue}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            isLoading={isLoading}
          />
        </Stack>
        {/* Render the Outlet for nested routes */}
        <Outlet />
      </Container>
      <Box ref={ref} h="10px" w="full" />
    </Stack>
  );
};
