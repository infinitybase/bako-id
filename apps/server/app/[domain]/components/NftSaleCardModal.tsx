'use client';

import { BTCIcon } from '@/components/icons/btcicon';
import { ContractIcon } from '@/components/icons/contracticon';
import { blacklistMetadataKeys } from '@/helpers/constant';
import type { Nft } from '@/types/marketplace';
import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { NftListMetadata } from './NftListMetadata';
import { NftMetadataBlock } from './NftMetadataBlock';
import { NftModal } from './modal';

interface NftSaleCardModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  nft: Nft;
  value: string;
  usdValue: string;
  asset: {
    id: string;
    iconUrl: string;
    name: string;
    decimals?: number;
  };
  name: string;
  imageUrl: string;
}

export const NftSaleCardModal = ({
  isOpen,
  onClose,
  nft,
  name,
  imageUrl,
  asset,
  value,
  usdValue,
}: NftSaleCardModalProps) => {
  const metadataArray = useMemo(
    () =>
      Object.entries(nft.metadata ?? {})
        .map(([key, value]) => ({
          label: key,
          value,
        }))
        .filter((item) => !blacklistMetadataKeys.includes(item.label)),
    [nft]
  );

  return (
    <NftModal.Root isOpen={isOpen} onClose={onClose}>
      <NftModal.Content
        flexDirection={{
          base: 'column',
          md: 'row',
        }}
        maxH="540px"
        overflowY={{
          base: 'scroll',
          md: 'hidden',
        }}
      >
        <NftModal.Image w="full" src={imageUrl} alt={name} />
        <Stack
          gap={8}
          w="full"
          overflowY={{
            base: 'unset',
            md: 'scroll',
          }}
          style={{ scrollbarWidth: 'none' }}
          maxH={{ md: '480px' }}
        >
          <Heading>{name}</Heading>
          <Stack spacing={2}>
            <Text>Description</Text>
            <Text fontSize="sm" color="grey.subtitle">
              {nft.description ?? 'Description not provided.'}
            </Text>
          </Stack>

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <NftMetadataBlock
                title="Asset ID"
                value={nft.id}
                icon={<BTCIcon />}
                isCopy
              />
            </GridItem>
            <GridItem>
              <NftMetadataBlock
                title="Contract ID"
                value={nft.contractId ?? 'N/A'}
                icon={<ContractIcon />}
                isCopy
              />
            </GridItem>
          </Grid>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center" gap={2}>
              <Image
                src={asset.iconUrl}
                alt="Asset icon"
                height={6}
                width={6}
              />
              <Text fontSize="sm" color="grey.title" fontWeight="semibold">
                {value}
              </Text>
              <Text fontSize="sm" color="grey.subtitle">
                ~ {usdValue}
              </Text>
            </Flex>
          </Stack>

          <NftListMetadata metadata={metadataArray} />
        </Stack>

        <NftModal.CloseIcon onClose={onClose} />
      </NftModal.Content>
    </NftModal.Root>
  );
};
