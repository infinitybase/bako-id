import { Flex, Skeleton, Stack, VStack } from '@chakra-ui/react';
import { CollectionItemSkeleton } from './collectionItemSkeleton';

export const CollectionListSkeleton = () => {
  return (
    <Stack gap={4}>
      {/* Header skeleton */}
      <Flex align="center" p={4} borderRadius="md">
        <Skeleton height="20px" width="150px" />
      </Flex>

      {/* Collection items skeleton */}
      <VStack spacing={4}>
        {Array.from({ length: 8 }, (_, index) => `collection-${index}`).map(
          (collectionId) => (
            <CollectionItemSkeleton key={collectionId} />
          )
        )}
      </VStack>
    </Stack>
  );
};
