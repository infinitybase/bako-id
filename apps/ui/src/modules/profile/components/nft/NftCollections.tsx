import { Card } from '@/components';
import { Pagination } from '@/components/pagination';
import { NFTCollectionSkeleton } from '@/components/skeletons/nftCollectionSkeleton';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { useCollections } from '@/hooks/useCollections';
import { Box, Flex, Grid, Heading, Stack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import ProfileWithoutAssets from '../profileWithoutAssets';
import { NftCollectionCard } from './NftCollectionCard';

export const NftCollections = ({
  resolver,
}: {
  resolver: string;
}) => {
  const { assets } = useListAssets();
  const [currentPage, setCurrentPage] = useState(1);

  const { collections, isLoading, totalPages, isPlaceholderData } =
    useCollections({
      address: resolver,
      page: currentPage,
    });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const emptyCollections = useMemo(
    () => collections.length === 0,
    [collections]
  );

  if (isLoading) {
    return <NFTCollectionSkeleton />;
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
      {collections.map((collection) => (
        <Box key={collection.name} mb={5}>
          <Heading fontSize="md" mb={3}>
            {collection.name}
          </Heading>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)',
            }}
            gap={6}
          >
            {collection.assets.map((a) => (
              <NftCollectionCard
                key={a.assetId}
                asset={a}
                assets={assets}
                resolver={resolver}
              />
            ))}
          </Grid>
        </Box>
      ))}

      {!emptyCollections && (
        <Stack alignItems="center" justifyContent="end" flexDir="row" gap={0}>
          <Pagination
            hasNextPage={currentPage < totalPages}
            hasPreviousPage={currentPage > 1}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isPlaceholderData}
          />
        </Stack>
      )}

      {emptyCollections && <ProfileWithoutAssets />}
    </Card>
  );
};
