import { Card } from '@/components';
import { NFTCollectionSkeleton } from '@/components/skeletons/nftCollectionSkeleton';
import { Grid, GridItem, Skeleton, Stack } from '@chakra-ui/react';

const ProfileWithoutHandlerSkeleton = () => {
  return (
    <Stack
      display="flex"
      h="fit-content"
      spacing={6}
      direction="column"
      w="full"
    >
      <Skeleton height={200} width="full" borderRadius="8px" />

      <Card gap={8}>
        <Stack direction="row" justifyContent="space-between">
          <Skeleton height={8} width={40} borderRadius={8} />
          <Skeleton height={8} width={20} borderRadius={8} />
        </Stack>

        <Grid templateColumns="repeat(5, 1fr)" gap={3}>
          {Array.from({ length: 5 }).map((_, index) => (
            <GridItem
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
            >
              <Skeleton
                w="full"
                minH={['372px', '360px', '163px', '216px']}
                rounded="lg"
              />
            </GridItem>
          ))}
        </Grid>
      </Card>

      <NFTCollectionSkeleton />
    </Stack>
  );
};

export default ProfileWithoutHandlerSkeleton;
