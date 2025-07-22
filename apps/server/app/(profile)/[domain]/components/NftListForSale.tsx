'use client';

import { Card } from '@/components/card';
import { Pagination } from '@/components/pagination';
import { useQueryParams } from '@/hooks/useQueryParams';
import type { Order } from '@/types/marketplace';
import { Grid, GridItem, Heading, Skeleton, Stack } from '@chakra-ui/react';
import { Fragment } from 'react';
import NftSaleCard from './NftSaleCard';

interface NftListForSaleProps {
  domain: string;
  chainId: number;
  orders?: Order[];
  isOrdersLoading: boolean;
  isPlaceholderData: boolean;
  paginationInfos: {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const NftListForSale = ({
  domain,
  chainId,
  orders,
  isOrdersLoading,
  isPlaceholderData,
  paginationInfos,
}: NftListForSaleProps) => {
  const { query, handleChangeQuery } = useQueryParams<{ page?: string }>({
    page: '0',
  });
  const { totalPages, hasNextPage, hasPreviousPage } = paginationInfos;

  const handlePageChange = (page: number) => {
    handleChangeQuery('page', page.toString());
  };

  const isEmptyOrders = !orders?.length;

  return (
    <Card
      hidden={isEmptyOrders && !isOrdersLoading && !hasPreviousPage}
      gap={6}
    >
      <Stack justifyContent="space-between" direction="row" alignItems="center">
        <Heading fontSize="lg">
          <Heading fontSize="lg" as="span" color="yellow.500">
            @{domain}
          </Heading>{' '}
          for sale
        </Heading>
      </Stack>

      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(5, 1fr)',
          lg: 'repeat(6, 1fr)',
        }}
        gap={6}
      >
        {isOrdersLoading && (
          <Fragment>
            {Array.from({ length: 6 }, () => (
              <GridItem key={crypto.randomUUID()}>
                <Skeleton height="200px" width="full" rounded="lg" />
              </GridItem>
            ))}
          </Fragment>
        )}

        {!isPlaceholderData &&
          orders?.map((order) => (
            <GridItem key={order.id}>
              <NftSaleCard order={order} chainId={chainId} />
            </GridItem>
          ))}

        {isEmptyOrders && !isOrdersLoading && (
          <GridItem colSpan={6} textAlign="center">
            <Heading fontSize="lg">No NFTs for sale</Heading>
          </GridItem>
        )}
      </Grid>
      <GridItem
        colSpan={6}
        display="flex"
        justifyContent="end"
        alignItems="center"
      >
        <Pagination
          isAccountOrders
          page={Number(query.page ?? 1)}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          isLoading={isOrdersLoading || isPlaceholderData}
          onPageChange={handlePageChange}
        />
      </GridItem>
    </Card>
  );
};
