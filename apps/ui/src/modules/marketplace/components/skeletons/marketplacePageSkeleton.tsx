import { Container, FormControl, Skeleton, Stack } from '@chakra-ui/react';
import { MarketplaceBannerSkeleton } from './marketplaceBannerSkeleton';
import { CollectionListSkeleton } from './collectionListSkeleton';

export const MarketplacePageSkeleton = () => {
  return (
    <Container
      maxWidth="container.xl"
      py={8}
      overflowY="scroll"
      sx={{
        '&::-webkit-scrollbar': {
          width: '0px',
        },
      }}
      maxH="100vh"
      pb={{
        base: 15,
        sm: 8,
      }}
    >
      <Stack gap={10}>
        <MarketplaceBannerSkeleton />
        {/* Search bar skeleton */}
        <FormControl>
          <Skeleton height="48px" borderRadius="md" />
        </FormControl>
        <CollectionListSkeleton />
      </Stack>
    </Container>
  );
};
