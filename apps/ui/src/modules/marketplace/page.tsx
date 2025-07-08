import { useDebounce } from '@/hooks/useDebounce';
import { Container, Stack } from '@chakra-ui/react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MarketplaceBanner, SearchBar } from './components';
import { CollectionList } from './components/collectionList';

import { useGetCollections } from '@/hooks/marketplace/useListCollections';
import type { Collection } from '@/types/marketplace';

export const MarketplacePage = () => {
  const navigate = useNavigate();
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
  } = useGetCollections({
    limit: 20,
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
      <Stack gap={10}>
        <MarketplaceBanner collections={initialBanners} />

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
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </Stack>
    </Container>
  );
};
