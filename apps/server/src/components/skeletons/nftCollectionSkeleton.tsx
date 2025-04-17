import { Card, Flex, Grid, Skeleton } from '@chakra-ui/react';

export const NFTCollectionSkeleton = () => {
  return (
    <Card
      w="full"
      display="block"
      alignItems="center"
      backdropFilter="blur(7px)"
      h={['auto', 'auto', 'auto', '370px']}
      p={6}
    >
      <Flex alignItems="center" justify="space-between">
        <Skeleton height="8" width="32" rounded="md" />
      </Flex>

      <Flex mb={3} mt={6} alignItems="center" justify="space-between">
        <Skeleton height="8" width="32" rounded="md" />
      </Flex>
      <Grid
        overflow="hidden"
        gap={3}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Skeleton key={index} w="full" minW={160} h={216} rounded="lg" />
        ))}
      </Grid>
    </Card>
  );
};
