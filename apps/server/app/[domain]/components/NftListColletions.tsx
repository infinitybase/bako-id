'use client';

import { Card } from '@/components/card';
import { metadataArrayToObject } from '@/helpers/metadata';
import { queryClient } from '@/providers';
import { type FuelAsset, FuelAssetService } from '@/services/fuel-assets';
import { parseURI } from '@/utils';
import { contractsId } from '@bako-id/contracts';
import { Box, Flex, Grid, Heading, HStack, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { NftCollectionCard } from './NftCollectionCard';

interface NftListCollectionsProps {
  chainId: number;
  resolver: string;
}

export const NftListCollections = ({
  chainId,
  resolver,
}: NftListCollectionsProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['nfts', resolver],
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

        if (metadataEntries.length === 0 && nft.uri?.endsWith('.json')) {
          const json: Record<string, string> = await fetch(parseURI(nft.uri))
            .then((res) => res.json())
            .catch(() => ({}));
          metadata = json;
        }

        for (const [key, value] of Object.entries(metadata)) {
          if (Array.isArray(value)) {
            const metadataValueRecord = metadataArrayToObject(value, key);
            Object.assign(metadata, metadataValueRecord);
            delete metadata[key];
            continue;
          }

          if (metadata[key] === undefined) {
            const matadataValue = value as string;
            metadata[key] = matadataValue as string;
          }
        }

        nft.metadata = metadata;

        const image = Object.entries(metadata).find(([key]) =>
          key.includes('image')
        )?.[1];
        nft.image = image ? parseURI(image) : undefined;

        if (nft.contractId === contractsId.mainnet.nft) {
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
  });

  const desiredOrder = ['Bako ID', 'Executoors'];
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

  console.log({ nftCollections });

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
      {nftCollections.map((collection) => (
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
    </Card>
  );
};
