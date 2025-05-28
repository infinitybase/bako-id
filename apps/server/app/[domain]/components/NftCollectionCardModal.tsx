import { BTCIcon } from '@/components/icons/btcicon';
import { ContractIcon } from '@/components/icons/contracticon';
import { parseURI } from '@/utils';
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { NftListMetadata } from './NftListMetadata';
import { NftMetadataBlock } from './NftMetadataBlock';
import { NftModal } from './modal';

interface NftCardModalProps {
  assetId: string;
  contractId?: string;
  nftName: React.ReactNode;
  metadata?: Record<string, string>;
  image: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NftCollectionCardModal = ({
  assetId,
  nftName,
  contractId,
  metadata,
  image,
  isOpen,
  onClose,
}: NftCardModalProps) => {
  const metadataArray = useMemo(() => {
    return Object.entries(metadata ?? {}).map(([key, value]) => ({
      label: key,
      value,
    }));
  }, [metadata]);

  return (
    <NftModal.Root onClose={onClose} isOpen={isOpen}>
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
        <NftModal.Image w="full" src={parseURI(image)} alt="NFT image" />
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
              <Text mt={3} fontSize="sm" color="section.500">
                {metadata?.description ?? 'Description not provided.'}
              </Text>
            </Box>

            <Flex direction="row" wrap="wrap" gap={3}>
              <NftMetadataBlock
                icon={<BTCIcon />}
                value={assetId}
                title="Asset ID"
                isCopy
              />

              <NftMetadataBlock
                icon={<ContractIcon />}
                value={contractId!}
                title="Contract Address"
                isCopy
              />
            </Flex>

            <NftListMetadata metadata={metadataArray} />
          </Stack>
        </Stack>

        <NftModal.CloseIcon onClose={onClose} />
      </NftModal.Content>
    </NftModal.Root>
  );
};
