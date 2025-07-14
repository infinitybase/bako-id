import { LightIcon } from '@/components';
import { BTCIcon } from '@/components/icons/btcicon';
import { ContractIcon } from '@/components/icons/contracticon';
import { BAKO_CONTRACTS_IDS } from '@/utils/constants';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { NftListMetadata } from '../NftListMetadata';
import { NftMetadataBlock } from '../NftMetadataBlock';

export default function NftDetailStep({
  nftName,
  contractId,
  assetId,
  metadata,
  collection,
  isOwner,
  onSellClick,
  ctaButtonVariant = 'primary',
}: {
  nftName: React.ReactNode;
  isOwner: boolean;
  contractId?: string;
  assetId?: string;
  metadata?: Record<string, string>;
  collection?: string;
  onSellClick: () => void;
  ctaButtonVariant?: 'primary' | 'mktPrimary';
}) {
  const metadataArray = useMemo(() => {
    return Object.entries(metadata ?? {}).map(([key, value]) => ({
      label: key,
      value,
    }));
  }, [metadata]);

  const isBakoIdNft = useMemo(
    () => BAKO_CONTRACTS_IDS.includes(contractId!),
    [contractId]
  );

  return (
    <Stack
      w="full"
      overflowY={{
        base: 'unset',
        md: 'scroll',
      }}
      style={{ scrollbarWidth: 'none' }}
      maxH={{ md: '480px' }}
    >
      <Heading fontSize="xl">{nftName}</Heading>
      <Stack spacing={6} flex={1} mt={6} maxH="full">
        <Box>
          <Heading fontSize="md">Description</Heading>
          <Text mt={3} fontSize="sm" color="section.500" wordBreak="break-all">
            {metadata?.description ?? 'Description not provided.'}
          </Text>
        </Box>

        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {assetId && (
            <GridItem>
              <NftMetadataBlock
                icon={<BTCIcon />}
                value={assetId}
                title="Asset ID"
                isCopy
              />
            </GridItem>
          )}

          {collection && (
            <GridItem>
              <NftMetadataBlock
                value={collection}
                title="Creator"
                icon={<LightIcon />}
              />
            </GridItem>
          )}

          <GridItem>
            <NftMetadataBlock
              icon={<ContractIcon />}
              value={contractId!}
              title="Contract Address"
              isCopy
            />
          </GridItem>
        </Grid>

        {isOwner && !isBakoIdNft && (
          <Button
            variant={ctaButtonVariant}
            w="full"
            onClick={onSellClick}
            py={4}
          >
            List
          </Button>
        )}

        <NftListMetadata metadata={metadataArray} />
      </Stack>
    </Stack>
  );
}
