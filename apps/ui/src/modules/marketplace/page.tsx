import { useDebounce } from '@/hooks/useDebounce';
import { Box, Container, Stack, useMediaQuery } from '@chakra-ui/react';
import { Outlet, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MarketplacePageSkeleton, SearchBar } from './components';
import { CollectionList } from './components/collectionList';

import { useGetCollections } from '@/hooks/marketplace/useListCollections';
import { useInView } from 'react-intersection-observer';
import { MarketplaceBanner } from './components/banner/collectionsBanner';
import { MobileCollectionList } from './components/mobile/mobileCollectionList';

export const MarketplacePage = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const [sortValue, setSortValue] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { search } = useSearch({ strict: false });
  const debouncedSearch = useDebounce<string>(search ?? '', 700);

  const [isMobile] = useMediaQuery('(min-width: 350px) and (max-width: 767px)');

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
      <MarketplaceBanner />
      <Container
        maxW="1280px"
        pr={{
          base: 0,
          sm: '23px',
        }}
        pl={{ base: 3, sm: '23px' }}
        py={8}
        overflowY="hidden"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0px',
          },
        }}
        pb={{
          base: 0,
          sm: 8,
        }}
      >
        <Stack gap={10}>
          <SearchBar
            value={search}
            onChange={handleChangeSearch}
            placeholder="Search collection"
          />

          {isMobile ? (
            <MobileCollectionList collections={data} isLoading={isLoading} />
          ) : (
            <CollectionList
              collections={data}
              sortValue={sortValue}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              isLoading={isLoading}
            />
          )}
        </Stack>
        {/* Render the Outlet for nested routes */}
        <Outlet />
      </Container>
      <Box ref={ref} h="10px" w="full" />
    </Stack>
  );
};
