import { Card } from '@/components';
import { CloseIcon } from '@/components/icons/closeIcon';
import { useListOrders } from '@/hooks/marketplace/useListOrders';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { Link, useSearch } from '@tanstack/react-router';
import { bn } from 'fuels';
import { Fragment, useMemo, useState } from 'react';
import NftSaleCard from './NftSaleCard';

export const NftListForSale = ({
  domain,
  address,
}: { domain: string; address: string }) => {
  const [isDelistOrder, setIsDelistOrder] = useState(false);
  const { page } = useSearch({
    strict: false,
  });

  const { orders, isLoading } = useListOrders({
    account: address,
    page: page || undefined,
  });
  const { wallet } = useWallet();

  const handleDelistOrder = () => {
    setIsDelistOrder((prev) => !prev);
  };

  const isEmptyOrders = !orders?.data?.length;

  const isOwner = useMemo(
    () => wallet?.address.b256Address === address,
    [wallet?.address.b256Address, address]
  );

  return (
    <Card hidden={isEmptyOrders && !isLoading && !isOwner} gap={6}>
      <Stack justifyContent="space-between" direction="row" alignItems="center">
        <Heading fontSize="lg">
          <Heading fontSize="lg" as="span" color="yellow.500">
            @{domain}
          </Heading>{' '}
          for sale
        </Heading>

        {isOwner && (
          <Button
            disabled={isEmptyOrders}
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
        {isLoading && (
          <Fragment>
            {Array.from({ length: 6 }, () => (
              <GridItem key={crypto.randomUUID()}>
                <Skeleton height="200px" width="full" rounded="lg" />
              </GridItem>
            ))}
          </Fragment>
        )}

        {orders?.data?.map((order) => (
          <GridItem key={order.id}>
            <NftSaleCard
              orderId={order.id}
              asset={order.asset}
              value={bn(order.itemPrice).formatUnits(order.asset?.decimals)}
              nft={order.nft}
              showDelistButton={isDelistOrder}
              isOwner={isOwner}
            />
          </GridItem>
        ))}

        {!isLoading && isEmptyOrders && (
          <GridItem as={Center} py={10} colSpan={6} gridArea="6fr">
            <Text
              color="grey.200"
              fontSize="xs"
              maxW="172px"
              textAlign={'center'}
            >
              It appears this user does not own any NFTs for sale yet.
            </Text>
          </GridItem>
        )}
      </Grid>
      <GridItem
        colSpan={6}
        display="flex"
        justifyContent="end"
        alignItems="center"
      >
        <Text fontSize="sm" mr={2}>
          {page ?? 1} - {orders?.totalPages ?? 1} of {orders?.totalPages ?? 1}
        </Text>
        <IconButton
          aria-label="Previous Page"
          variant="unstyled"
          disabled={!orders?.hasPreviousPage}
          size="sm"
        >
          <Link
            search={{ page: Number(page) - 1 }}
            to="."
            disabled={!orders?.hasPreviousPage}
          >
            <ChevronLeftIcon fontSize="2xl" />
          </Link>
        </IconButton>
        <IconButton
          aria-label="Next Page"
          variant="unstyled"
          disabled={!orders?.hasNextPage}
          size="sm"
        >
          <Link
            search={{ page: Number(page ?? 1) + 1 }}
            to="."
            disabled={!orders?.hasNextPage}
          >
            <ChevronRightIcon fontSize="2xl" />
          </Link>
        </IconButton>
      </GridItem>
    </Card>
  );
};
