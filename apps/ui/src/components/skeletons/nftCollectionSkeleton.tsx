import { Flex, Grid, Skeleton } from '@chakra-ui/react';
import { Card } from '../card';

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
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            w="full"
            minH={['372px', '360px', '163px', '216px']}
            rounded="lg"
          />
        ))}
      </Grid>
    </Card>
  );
};
