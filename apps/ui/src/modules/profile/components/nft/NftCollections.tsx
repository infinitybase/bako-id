import { Pagination } from '@/components/pagination';
import { NFTCollectionSkeleton } from '@/components/skeletons/nftCollectionSkeleton';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { useCollections } from '@/hooks/useCollections';
import { Box, Flex, Grid, Heading, Stack } from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { useMemo, useState } from 'react';
import ProfileWithoutAssets from '../profileWithoutAssets';
import { NftCollectionCard } from './NftCollectionCard';
import { Card } from '@/components';
import { BAKO_CONTRACTS_IDS } from '@/utils/constants';

export const NftCollections = ({
  resolver,
}: {
  resolver: string;
}) => {
  const { assets } = useListAssets();
  const [currentPage, setCurrentPage] = useState(1);
  const { wallet, isLoading: isLoadingWallet } = useWallet();

  const {
    collections: notListedCollections,
    isLoading,
    totalPages,
    isPlaceholderData,
  } = useCollections({
    address: resolver,
    page: currentPage,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const ownerDomain = wallet?.address.b256Address;
  const isOwner = useMemo(
    () => ownerDomain === resolver,
    [ownerDomain, resolver]
  );

  const notListedCollectionsWithoutHandles = notListedCollections.filter(
    (collection) =>
      !BAKO_CONTRACTS_IDS.includes(collection.assets[0]?.contractId ?? '')
  );

  const emptyCollections = useMemo(
    () => notListedCollectionsWithoutHandles.length === 0,
    [notListedCollectionsWithoutHandles]
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
      hidden={!isLoadingWallet && !isOwner && emptyCollections}
    >
      <Flex mb={6} alignItems="center" justify="space-between">
        <Heading fontSize="lg">NFT</Heading>
      </Flex>
      {notListedCollectionsWithoutHandles.map((collection) => (
        <Box key={collection.name} mb={5}>
          <Heading fontSize="md" mb={3}>
            {collection.name}
          </Heading>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(6, 1fr)',
            }}
            gap={6}
          >
            {collection.assets.map((a) => {
              return (
                <NftCollectionCard
                  key={a.assetId}
                  asset={a}
                  assets={assets}
                  resolver={resolver}
                  isOwner={isOwner}
                />
              );
            })}
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
