import { Card } from '@/components';
import { NFTCollectionSkeleton } from '@/components/skeletons/nftCollectionSkeleton';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { FuelAssetService, type FuelAsset } from '@/services/fuel-assets';
import { BAKO_CONTRACTS_IDS } from '@/utils/constants';
import { formatMetadataFromIpfs, parseURI } from '@/utils/formatter';
import { Box, Flex, Grid, Heading } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isNil } from 'lodash';
import { useMemo } from 'react';
import ProfileWithoutAssets from '../profileWithoutAssets';
import { NftCollectionCard } from './NftCollectionCard';

const desiredOrder = ['Bako ID', 'Executoors'];

export const NftCollections = ({
  resolver,
  chainId = 9889,
}: {
  resolver: string;
  chainId?: number | null;
}) => {
  const queryClient = useQueryClient();
  const { assets } = useListAssets();
  const { data, isLoading } = useQuery({
    queryKey: ['nfts', chainId, resolver],
    queryFn: async () => {
      const { data } = await FuelAssetService.byAddress({
        address: resolver,
        chainId: chainId!,
      });

      const nfts = data.filter((a) => !!a.isNFT) as (FuelAsset & {
        image?: string;
      })[];

      for (const nft of nfts) {
        let metadata: Record<string, string> = nft.metadata ?? {};
        const metadataEntries = Object.entries(metadata).filter(
          ([key]) => !['uri', 'image'].includes(key.toLowerCase())
        );

        if (metadataEntries.length === 0 && nft.uri) {
          const json: Record<string, string> = await fetch(parseURI(nft.uri))
            .then((res) => res.json())
            .catch(() => ({}));
          metadata = json;
        }

        const formattedMetadata = formatMetadataFromIpfs(metadata);

        nft.metadata = formattedMetadata;

        const image = Object.entries(formattedMetadata).find(([key]) =>
          key.includes('image')
        )?.[1];
        nft.image = image ? parseURI(image) : undefined;

        if (nft.contractId && BAKO_CONTRACTS_IDS.includes(nft.contractId)) {
          nft.collection = 'Bako ID';
        }

        queryClient.setQueryData(['nft-metadata', nft.assetId], nft.metadata);
      }

      return nfts.sort((a, b) => {
        if (a.image && !b.image) return -1;
        if (!a.image && b.image) return 1;
        return 0;
      });
    },
    select: (data) => data?.filter((a) => !!a.isNFT),
    enabled: !isNil(chainId),
  });

  const nftCollections = useMemo(
    () =>
      data
        ?.reduce(
          (acc, curr) => {
            const collectionName = curr?.collection ?? 'Other';
            const collectionAssets = acc.find((c) => c.name === collectionName);
            if (collectionAssets) {
              collectionAssets.assets.push(curr);
            } else {
              acc.push({
                name: collectionName,
                assets: [curr],
              });
            }

            return acc;
          },
          [] as {
            name: string;
            assets: (FuelAsset & {
              image?: string;
            })[];
          }[]
        )
        .sort((a, b) => {
          if (a.name === 'Other') return 1;
          if (b.name === 'Other') return -1;

          const indexA = desiredOrder.indexOf(a.name);
          const indexB = desiredOrder.indexOf(b.name);

          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          if (indexA !== -1) {
            return -1;
          }
          if (indexB !== -1) {
            return 1;
          }
          return a.name.localeCompare(b.name);
        }) ?? [],
    [data]
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
      {nftCollections.map((collection) => (
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
              <NftCollectionCard key={a.assetId} asset={a} assets={assets} />
            ))}
          </Grid>
        </Box>
      ))}
      {!nftCollections?.length && <ProfileWithoutAssets />}
    </Card>
  );
};
