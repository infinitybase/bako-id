import { Card } from '@/components';
import { CloseIcon } from '@/components/icons/closeIcon';
import { Pagination } from '@/components/pagination';
import type { Order } from '@/types/marketplace';
import { formatAddress } from '@/utils/formatter';
import type { PaginationResult } from '@/utils/pagination';
import { Button, Grid, GridItem, Heading, Stack, Text } from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { useSearch } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import NftSaleCard from './NftSaleCard';

export const NftListForSale = ({
  domain,
  orders,
  address,
  hiddenWhenEmpty = false,
  withHandle,
}: {
  domain?: string;
  orders: PaginationResult<Order> | undefined;
  address: string;
  hiddenWhenEmpty?: boolean;
  withHandle: boolean;
}) => {
  const [isDelistOrder, setIsDelistOrder] = useState(false);
  const { page } = useSearch({
    strict: false,
  });
  const { wallet } = useWallet();

  const handleDelistOrder = () => {
    setIsDelistOrder((prev) => !prev);
  };

  const isEmptyOrders = !orders?.data?.length;

  const isOwner = useMemo(
    () => wallet?.address.b256Address.toLowerCase() === address.toLowerCase(),
    [wallet?.address.b256Address, address]
  );

  return (
    <Card hidden={isEmptyOrders && (hiddenWhenEmpty || !isOwner)} gap={6}>
      <Stack justifyContent="space-between" direction="row" alignItems="center">
        <Heading fontSize="lg">
          <Heading fontSize="lg" as="span" color="yellow.500">
            {domain ? `@${domain}` : formatAddress(address)}
          </Heading>{' '}
          {!isEmptyOrders ? 'for sale' : 'has nothing to sale'}
        </Heading>

        {isOwner && !isEmptyOrders && (
          <Button
            size="sm"
            variant="ghosted"
            w="auto"
            rightIcon={isDelistOrder ? undefined : <CloseIcon />}
            onClick={handleDelistOrder}
          >
            {isDelistOrder ? 'Done' : 'Delist'}
          </Button>
        )}
        {isEmptyOrders && (
          <Text color="grey.200" fontSize="sm" textAlign={'center'}>
            Choose NFTs below to list
          </Text>
        )}
      </Stack>

      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(6, 1fr)',
        }}
        gap={6}
      >
        {orders?.data?.map((order) => (
          <GridItem key={order.id}>
            <NftSaleCard
              order={order}
              showDelistButton={isDelistOrder}
              isOwner={isOwner}
              showBuyButton={!isOwner}
              withHandle={withHandle}
            />
          </GridItem>
        ))}
      </Grid>
      {!isEmptyOrders && (
        <GridItem
          colSpan={6}
          display="flex"
          justifyContent="end"
          alignItems="center"
        >
          <Pagination
            page={Number(page ?? 1)}
            totalPages={orders?.totalPages}
            hasNextPage={orders?.hasNextPage}
            hasPreviousPage={orders?.hasPreviousPage}
          />
        </GridItem>
      )}
    </Card>
  );
};
