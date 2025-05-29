'use client';

import { Card } from '@/components/card';
import { Pagination } from '@/components/pagination';
import type { PaginationResult } from '@/helpers/pagination';
import { useListOrders } from '@/hooks/useListOrders';
import { useQueryParams } from '@/hooks/useQueryParams';
import type { Order } from '@/types/marketplace';
import { Grid, GridItem, Heading, Skeleton, Stack } from '@chakra-ui/react';
import { bn } from 'fuels';
import { Fragment } from 'react';
import NftSaleCard from './NftSaleCard';

interface NftListForSaleProps {
  domain: string;
  address: string;
  chainId: number;
  initialOrders?: PaginationResult<Order>;
}

export const NftListForSale = ({
  domain,
  address,
  chainId,
  initialOrders,
}: NftListForSaleProps) => {
  const { query, handleChangeQuery } = useQueryParams<{ page?: string }>({
    page: '1',
  });

  const { orders, isLoading, isPlaceholderData } = useListOrders({
    account: address,
    page: Number(query.page ?? '1'),
    chainId,
    initialOrders,
  });

  const handlePageChange = (page: number) => {
    handleChangeQuery('page', page.toString());
  };

  const isEmptyOrders = !orders?.data?.length;

  return (
    <Card
      hidden={isEmptyOrders && !isLoading && !orders?.hasPreviousPage}
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
        {(isLoading || isPlaceholderData) && (
          <Fragment>
            {Array.from({ length: 6 }, () => (
              <GridItem key={crypto.randomUUID()}>
                <Skeleton height="200px" width="full" rounded="lg" />
              </GridItem>
            ))}
          </Fragment>
        )}

        {!isPlaceholderData &&
          orders?.data?.map((order) => (
            <GridItem key={order.id}>
              <NftSaleCard
                orderId={order.id}
                asset={order.asset}
                value={bn(order.itemPrice).formatUnits(order.asset?.decimals)}
                nft={order.nft}
              />
            </GridItem>
          ))}

        {isEmptyOrders && !isLoading && (
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
          onPageChange={handlePageChange}
          page={Number(query.page ?? 1)}
          totalPages={orders?.totalPages}
          hasNextPage={orders?.hasNextPage}
          hasPreviousPage={orders?.hasPreviousPage}
          isFetching={isLoading || isPlaceholderData}
        />
      </GridItem>
    </Card>
  );
};
