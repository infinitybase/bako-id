import { Box, Flex, Skeleton } from '@chakra-ui/react';

export const CollectionItemSkeleton = () => {
  return (
    <Flex
      width="100%"
      p={4}
      borderRadius="md"
      justify="space-between"
      align="center"
      border="1px solid"
      borderColor="grey.300"
    >
      <Flex align="center" gap={3}>
        <Skeleton boxSize="40px" borderRadius="md" />
        <Box>
          <Skeleton height="16px" width="120px" />
        </Box>
      </Flex>

      <Flex gap={3}>
        {Array.from({ length: 4 }, (_, index) => `collection-${index}`).map(
          (key) => (
            <Skeleton key={key} boxSize="40px" borderRadius="md" />
          )
        )}
      </Flex>
    </Flex>
  );
};
