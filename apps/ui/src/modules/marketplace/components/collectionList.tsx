import nftEmpty from '@/assets/nft-empty.png';
import {
  Box,
  Flex,
  Heading,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
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
import { useEffect, useState } from 'react';
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
  const [isImageLoading, setIsImageLoading] = useState(true);

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
          h="56px"
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
          <Flex flex="2" align="center" gap={3}>
            <ImageSkeleton isImageLoading={isImageLoading}>
              <Image
                src={parseURI(col?.config?.avatar ?? '')}
                boxSize="40px"
                borderRadius="md"
                onLoad={() => setIsImageLoading(false)}
                onError={(e) => {
                  e.currentTarget.src = nftEmpty;
                  setIsImageLoading(false);
                }}
              />
            </ImageSkeleton>
            <Text>{isB256(col.name) ? formatAddress(col.name) : col.name}</Text>
          </Flex>
          <Box flex="1">{col.metrics.volume.toFixed(4)} ETH</Box>
          <Box flex="1">{col.metrics.floorPrice.toFixed(4)} ETH</Box>
          <Box flex="1">{col.metrics.sales}</Box>
          <Flex flex="1">
            {col.latestSalesNFTs.map((item) => (
              <ImageSkeleton key={item.id} isImageLoading={isImageLoading}>
                <Image
                  src={parseURI(item.image ?? '')}
                  boxSize="40px"
                  borderRadius="md"
                  mr={2}
                  onLoad={() => setIsImageLoading(false)}
                  onError={(e) => {
                    e.currentTarget.src = nftEmpty;
                    setIsImageLoading(false);
                  }}
                />
              </ImageSkeleton>
            ))}
          </Flex>
        </Flex>
      ))}

      <Box ref={ref} h="10px" w="full" />
    </Box>
  );
};

const ImageSkeleton = ({
  children,
  isImageLoading,
}: { children: React.ReactNode; isImageLoading: boolean }) => {
  return (
    <Skeleton
      isLoaded={!isImageLoading}
      borderRadius="md"
      boxSize="42px"
      border="1px solid"
      borderColor="grey.600"
      backdropFilter={isImageLoading ? 'blur(24px)' : 'blur(0px)'}
    >
      {children}
    </Skeleton>
  );
};
