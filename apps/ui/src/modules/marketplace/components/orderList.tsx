import NftSaleCard from '@/modules/profile/components/nft/NftSaleCard';
import type { Order } from '@/types/marketplace';
import { GridItem, Heading, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { bn } from 'fuels';
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
        lg: 6,
        md: 5,
        sm: 3,
        base: 2,
      }}
    >
      {orders.map((order) => (
        <NftSaleCard
          key={order.id}
          asset={order.asset}
          orderId={order.id}
          nft={order.nft}
          showDelistButton={false}
          value={bn(order.itemPrice).formatUnits(order.asset?.decimals)}
          isOwner={address === order.seller}
          showBuyButton
        />
      ))}

      <GridItem
        colSpan={{
          lg: 6,
          md: 5,
          sm: 3,
          base: 2,
        }}
        mb={10}
        ref={ref}
      />

      {isEmptyOrders && !isLoadingOrders && (
        <GridItem
          colSpan={{
            lg: 6,
            md: 5,
            sm: 3,
            base: 2,
          }}
        >
          <Heading size="md" textAlign="center">
            No orders available
          </Heading>
        </GridItem>
      )}

      {isLoadingOrders && (
        <Fragment>
          {Array.from({ length: 12 }, () => (
            <Skeleton key={Math.random()} height="250px" borderRadius="lg" />
          ))}
        </Fragment>
      )}
    </SimpleGrid>
  );
};
