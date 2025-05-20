import { useListOrders } from '@/hooks/marketplace/useListOrders';
import { useDebounce } from '@/hooks/useDebounce';
import { Container, Stack } from '@chakra-ui/react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMemo } from 'react';
import { MarketplaceBanner, OrderList, SearchBar } from './components';

export const MarketplacePage = () => {
  const navigate = useNavigate();
  const { search } = useSearch({ strict: false });
  const debouncedSearch = useDebounce<string>(search ?? '', 500);
  const { orders, isLoading, fetchNextPage, hasNextPage } = useListOrders({
    limit: 20,
    search: debouncedSearch,
  });

  const data = useMemo(
    () => orders?.pages?.flatMap((page) => page.data) ?? [],
    [orders]
  );

  const handleChangeSearch = (search: string) => {
    navigate({
      search: {
        // @ts-expect-error - TODO: add type for search in router schema
        search,
      },
    });
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
        <MarketplaceBanner />

        <SearchBar onSearch={handleChangeSearch} value={search as string} />

        <OrderList
          orders={data}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          isLoadingOrders={isLoading}
        />
      </Stack>
    </Container>
  );
};
