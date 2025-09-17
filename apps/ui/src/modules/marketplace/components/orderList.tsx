import { useResolverName } from '@/hooks';
import NftSaleCard from '@/modules/profile/components/nft/NftSaleCard';
import type { Order } from '@/types/marketplace';
import { GridItem, Heading, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { ZeroBytes32 } from 'fuels';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface OrderListProps {
  orders: Order[];
  onFetchNextPage: () => void;
  hasNextPage: boolean;
  isLoadingOrders?: boolean;
  isFetchingNextPage?: boolean;
  collectionOrdersLimit?: number;
  isPlaceholderData: boolean;
}

export const OrderList = ({
  orders,
  isLoadingOrders = false,
  onFetchNextPage,
  hasNextPage,
  isFetchingNextPage = false,
  collectionOrdersLimit = 10,
  isPlaceholderData,
}: OrderListProps) => {
  const { wallet } = useWallet();
  const { ref, inView } = useInView();
  const isEmptyOrders = !orders?.length;
  const { data } = useResolverName(wallet?.address.b256Address ?? ZeroBytes32);

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      orders.length >= collectionOrdersLimit - 1
    ) {
      onFetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    onFetchNextPage,
    isFetchingNextPage,
    orders,
    collectionOrdersLimit,
  ]);

  return (
    <SimpleGrid
      gap="22px"
      pb={10}
      columns={{
        md: 5,
        sm: 3,
        xs: 2,
        base: 1,
      }}
      mx={{ base: 'auto', sm: 'unset' }}
    >
      {orders.map((order) => {
        const isOwner = wallet?.address.b256Address === order.seller;
        return (
          <NftSaleCard
            key={order.id}
            order={order}
            isOwner={isOwner}
            showAnimatedButton
            withHandle={!!data}
            imageSize="full"
            ctaButtonVariant="mktPrimary"
          />
        );
      })}
      {isLoadingOrders &&
        !isPlaceholderData &&
        Array.from({ length: 5 }, () => (
          <GridItem key={Math.random()}>
            <Skeleton height="250px" borderRadius="lg" />
          </GridItem>
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
    </SimpleGrid>
  );
};
