import { Card } from '@/components';
import { CloseIcon } from '@/components/icons/closeIcon';
import { Pagination } from '@/components/pagination';
import { useResolverName } from '@/hooks';
import type { Order } from '@/types/marketplace';
import { AddressUtils } from '@/utils/address';
import { formatAddress } from '@/utils/formatter';
import type { PaginationResult } from '@/utils/pagination';
import {
  Button,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { useSearch } from '@tanstack/react-router';
import { ZeroBytes32 } from 'fuels';
import { useMemo, useState } from 'react';
import NftSaleCard from './NftSaleCard';

export const NftListForSale = ({
  domain,
  address,
  isLoadingOrders,
  orders,
}: {
  domain?: string;
  address: string;
  isLoadingOrders?: boolean;
  orders: PaginationResult<Order> | undefined;
}) => {
  const [isDelistOrder, setIsDelistOrder] = useState(false);
  const { page } = useSearch({
    strict: false,
  });
  const { wallet } = useWallet();
  const { data } = useResolverName(wallet?.address.b256Address || ZeroBytes32);

  const handleDelistOrder = () => {
    setIsDelistOrder((prev) => !prev);
  };

  const isEmptyOrders = useMemo(() => !orders?.data?.length, [orders]);

  const isOwner = useMemo(
    () => AddressUtils.isEqual(wallet?.address.b256Address, address),
    [wallet?.address, address]
  );

  return (
    <Card hidden={isEmptyOrders && !isOwner} gap={6} order={isOwner ? 1 : 0}>
      <Stack justifyContent="space-between" direction="row" alignItems="center">
        <Heading fontSize="lg">
          <Heading fontSize="lg" as="span" color="yellow.500">
            {domain ? `@${domain}` : formatAddress(address)}
          </Heading>{' '}
          for sale
        </Heading>

        {isOwner && (
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
        {!isLoadingOrders &&
          orders?.data?.map((order) => (
            <GridItem key={order.id}>
              <NftSaleCard
                order={order}
                showDelistButton={isDelistOrder}
                isOwner={isOwner}
                showBuyButton={!isOwner}
                withHandle={!!data}
              />
            </GridItem>
          ))}
        {isLoadingOrders &&
          new Array(12).fill(null).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <GridItem key={index}>
              <Skeleton height="260px" borderRadius="md" />
            </GridItem>
          ))}
      </Grid>

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
          isLoading={isLoadingOrders}
        />
      </GridItem>
    </Card>
  );
};
