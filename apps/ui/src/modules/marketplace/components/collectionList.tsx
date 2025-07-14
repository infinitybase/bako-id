import UnknownAsset from '@/assets/unknown-asset.png';
import { Box, Flex, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { ListHeader } from './listHeader';
import type { Collection } from '@/types/marketplace';
import { formatAddress, parseURI } from '@/utils/formatter';

type SortDirection = 'asc' | 'desc';

type CollectionListProps = {
  collections: Collection[];
  sortValue: string;
  sortDirection: SortDirection;
  onSortChange: (column: string) => void;
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { isB256 } from 'fuels';
import { useRouter } from '@tanstack/react-router';

const listHeaderItems = [
  {
    label: 'Volume',
    sortKey: 'metrics.volume',
  },
  {
    label: 'Floor price',
    sortKey: 'metrics.floorPrice',
  },
  {
    label: 'Sales',
    sortKey: 'metrics.sales',
  },
  {
    label: 'Last sold',
    sortKey: 'lastSold',
  },
];

export const CollectionList = ({
  collections,
  sortValue,
  sortDirection,
  onSortChange,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: CollectionListProps) => {
  const isEmptyCollections = !collections?.length;
  const { ref, inView } = useInView();

  const router = useRouter();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <Box>
      {isEmptyCollections && !isLoading && (
        <VStack>
          <Heading size="md" textAlign="center">
            No collections available
          </Heading>
        </VStack>
      )}

      {!isEmptyCollections && (
        <Flex px={2} py={2} fontWeight="bold" color="gray.400" mb={6}>
          <Text color="white" flex="2" fontWeight={600} fontSize="sm">
            Collection name
          </Text>
          {listHeaderItems.map((item) => (
            <ListHeader
              key={item.sortKey}
              sortValue={sortValue}
              sortDirection={sortDirection}
              onSortChange={onSortChange}
              label={item.label}
              sortKey={item.sortKey}
            />
          ))}
        </Flex>
      )}

      {collections.map((col) => (
        <Flex
          key={col.id}
          align="center"
          px={2}
          py={3}
          borderRadius="md"
          bg="transparent"
          mb={2}
          border="1px solid"
          borderColor="grey.600"
          justifyContent="space-between"
          cursor="pointer"
          onClick={() => {
            router.navigate({
              to: '/marketplace/collection/$collectionId',
              params: {
                collectionId: col.id,
              },
            });
          }}
        >
          <Flex flex="2" align="center">
            <Image
              src={parseURI(col.config.avatar) ?? UnknownAsset}
              boxSize="40px"
              borderRadius="md"
              mr={3}
            />
            <Text>{isB256(col.name) ? formatAddress(col.name) : col.name}</Text>
          </Flex>
          <Box flex="1">{col.metrics.volume.toFixed(4)} ETH</Box>
          <Box flex="1">
            {Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              style: 'currency',
              currency: 'USD',
            }).format(Number(col?.metrics?.floorPrice ?? 0))}
          </Box>
          <Box flex="1">{col.metrics.sales}</Box>
          <Flex flex="1">
            {col.latestSalesNFTs.map((img) => (
              <Image
                key={img}
                src={img}
                boxSize="32px"
                borderRadius="md"
                mr={2}
                border="2px solid #222"
              />
            ))}
          </Flex>
        </Flex>
      ))}

      <Box ref={ref} h="10px" w="full" />
    </Box>
  );
};
