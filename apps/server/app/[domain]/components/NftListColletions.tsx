'use client';

import { Card } from '@/components/card';
import { Pagination } from '@/components/pagination';
import { useCollections } from '@/hooks/useCollections';
import {} from '@/services/fuel-assets';
import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { NftCollectionCard } from './NftCollectionCard';

interface NftListCollectionsProps {
  chainId: number;
  resolver: string;
}

export const NftListCollections = ({
  chainId,
  resolver,
}: NftListCollectionsProps) => {
  const [page, setPage] = useState(1);
  const { collections, isLoading, isPlaceholderData, totalPages } =
    useCollections({ address: resolver, chainId, page });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const emptyCollections = useMemo(
    () => collections.length === 0,
    [collections]
  );

  if (isLoading) {
    return (
      <Card
        w="full"
        h="fit-content"
        display="block"
        alignItems="center"
        backdropFilter="blur(7px)"
      >
        <Flex mb={3} alignItems="center" justify="space-between">
          <Skeleton height="8" width="32" rounded="md" />
        </Flex>
        <HStack overflow="hidden" gap={3}>
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
        </HStack>
      </Card>
    );
  }

  return (
    <Card
      w="full"
      h={['fit-content', 'fit-content', 'fit-content', 'auto']}
      display="flex"
      backdropFilter="blur(6px)"
      flexDirection="column"
      boxShadow="lg"
    >
      <Flex mb={6} alignItems="center" justify="space-between">
        <Heading fontSize="lg">NFT</Heading>
      </Flex>
      {!isPlaceholderData &&
        collections.map((collection) => (
          <Box key={collection.name} mb={5}>
            <Heading fontSize="md" mb={3}>
              {collection.name}
            </Heading>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)',
                lg: 'repeat(6, 1fr)',
              }}
              gap={6}
            >
              {collection.assets.map((a) => (
                <NftCollectionCard key={a.assetId} asset={a} />
              ))}
            </Grid>
          </Box>
        ))}

      {isPlaceholderData && (
        <>
          <Flex mb={3} alignItems="center" justify="space-between">
            <Skeleton height="8" width="32" rounded="md" />
          </Flex>
          <HStack overflow="hidden" gap={3} mb={5}>
            <Skeleton w="full" minW={160} h={160} rounded="lg" />
            <Skeleton w="full" minW={160} h={160} rounded="lg" />
            <Skeleton w="full" minW={160} h={160} rounded="lg" />
            <Skeleton w="full" minW={160} h={160} rounded="lg" />
            <Skeleton w="full" minW={160} h={160} rounded="lg" />
            <Skeleton w="full" minW={160} h={160} rounded="lg" />
          </HStack>
        </>
      )}

      {!emptyCollections && (
        <Stack alignItems="center" justifyContent="end" flexDir="row" gap={0}>
          <Pagination
            onPageChange={handlePageChange}
            hasNextPage={page < totalPages}
            hasPreviousPage={page > 1}
            page={page}
            totalPages={totalPages}
            isFetching={isPlaceholderData}
          />
        </Stack>
      )}
    </Card>
  );
};
