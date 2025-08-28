import { Card } from '@/components';
import { CloseIcon } from '@/components/icons/closeIcon';
import { Pagination } from '@/components/pagination';
import { useResolverName } from '@/hooks';
import type { Order } from '@/types/marketplace';
import { AddressUtils } from '@/utils/address';
import {
  Button,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ZeroBytes32 } from 'fuels';
import { useMemo, useState } from 'react';
import NftSaleCard from './NftSaleCard';

export const NftListForSale = ({
  address,
  isLoadingOrders,
  orders,
  paginationInfos,
  isProfilePage,
}: {
  address: string;
  isLoadingOrders?: boolean;
  orders: Order[] | undefined;
  paginationInfos: {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isProfilePage?: boolean;
}) => {
  const [isDelistOrder, setIsDelistOrder] = useState(false);
  const { page } = useSearch({ strict: false });
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const { data } = useResolverName(wallet?.address.b256Address || ZeroBytes32);

  const handleDelistOrder = () => {
    setIsDelistOrder((prev) => !prev);
  };

  const handlePageChange = (page: number) => {
    // @ts-expect-error - TODO: add type for page in router schema
    navigate({ search: { page } });
  };

  const isEmptyOrders = useMemo(() => !orders?.length, [orders]);

  const isOwner = useMemo(
    () => AddressUtils.isEqual(wallet?.address.b256Address, address),
    [wallet?.address, address]
  );

  const userWithoutHandle = useMemo(() => !data, [data]);

  const hiddenCard =
    (isEmptyOrders && !isOwner) || (isEmptyOrders && userWithoutHandle);

  return (
    <Card hidden={hiddenCard} gap={6} order={isOwner ? 1 : 0}>
      <Stack justifyContent="space-between" direction="row" alignItems="center">
        <Heading fontSize="lg">For sale</Heading>

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
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: 'repeat(6, 1fr)',
        }}
        gap={6}
      >
        {!isLoadingOrders &&
          orders?.map((order) => (
            <GridItem key={order.id}>
              <NftSaleCard
                order={order}
                isOwner={isOwner}
                showAnimatedButton={!isOwner}
                withHandle={!!data}
                isProfilePage={isProfilePage}
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
          isAccountOrders
          page={Number(page ?? 1)}
          totalPages={paginationInfos.totalPages}
          hasNextPage={paginationInfos.hasNextPage}
          hasPreviousPage={paginationInfos.hasPreviousPage}
          isLoading={isLoadingOrders}
          onPageChange={handlePageChange}
        />
      </GridItem>
    </Card>
  );
};
