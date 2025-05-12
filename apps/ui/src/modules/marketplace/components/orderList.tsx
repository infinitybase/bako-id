import NftSaleCard from '@/modules/profile/components/nft/NftSaleCard';
import type { Order } from '@/types/marketplace';
import { GridItem, Heading, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { Fragment, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

interface OrderListProps {
  orders: Order[];
  onFetchNextPage: () => void;
  hasNextPage: boolean;
  isLoadingOrders?: boolean;
}

export const OrderList = ({
  orders,
  isLoadingOrders = false,
  onFetchNextPage,
  hasNextPage,
}: OrderListProps) => {
  const { wallet } = useWallet();
  const { ref, inView } = useInView();
  const isEmptyOrders = !orders?.length;

  const address = useMemo(() => wallet?.address.b256Address, [wallet]);

  useEffect(() => {
    if (inView && hasNextPage) {
      onFetchNextPage();
    }
  }, [inView, hasNextPage, onFetchNextPage]);

  return (
    <SimpleGrid
      gap={3}
      pb={10}
      columns={{
        md: 5,
        sm: 3,
        base: 1,
      }}
    >
      {orders.map((order) => (
        <NftSaleCard
          key={order.id}
          order={order}
          showDelistButton={false}
          isOwner={address === order.seller}
          showBuyButton
        />
      ))}

      <GridItem
        colSpan={{
          md: 5,
          sm: 3,
          base: 1,
        }}
        mb={10}
        ref={ref}
      />

      {isEmptyOrders && !isLoadingOrders && (
        <GridItem
          colSpan={{
            md: 5,
            sm: 3,
            base: 1,
          }}
        >
          <Heading size="md" textAlign="center">
            No orders available
          </Heading>
        </GridItem>
      )}

      {isLoadingOrders && (
        <Fragment>
          {Array.from({ length: 5 }, () => (
            <Skeleton key={Math.random()} height="250px" borderRadius="lg" />
          ))}
        </Fragment>
      )}
    </SimpleGrid>
  );
};
