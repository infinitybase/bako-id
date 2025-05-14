import { LightIcon, useCustomToast } from '@/components';
import { BTCIcon } from '@/components/icons/btcicon';
import { ContractIcon } from '@/components/icons/contracticon';
import { useCreateOrder } from '@/hooks/marketplace';
import type { Asset } from '@/types/marketplace';
import { BAKO_CONTRACTS_IDS } from '@/utils/constants';
import { parseURI } from '@/utils/formatter';
import { Box, Grid, GridItem, Heading, Stack, Text } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';
import { NftCardSaleForm, type NftSaleCardForm } from './NftCardSaleForm';
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
  assets: Asset[];
  isOwner: boolean;
  collection?: string;
}

export const NftCardModal = ({
  assetId,
  nftName,
  contractId,
  metadata,
  image,
  isOpen,
  onClose,
  assets,
  isOwner,
  collection,
}: NftCardModalProps) => {
  const { createOrderAsync, isPending } = useCreateOrder();
  const { successToast, errorToast } = useCustomToast();
  const metadataArray = useMemo(() => {
    return Object.entries(metadata ?? {}).map(([key, value]) => ({
      label: key,
      value,
    }));
  }, [metadata]);

  const handleCreateOrder = async (data: NftSaleCardForm) => {
    try {
      await createOrderAsync({
        itemAsset: assetId,
        itemAmount: bn(1),
        sellPrice: bn.parseUnits(data.sellPrice.toString()),
        sellAsset: data.sellAsset.id,
      });
      successToast({ title: 'Order created successfully!' });
      onClose();
    } catch (error) {
      console.error(error);
      errorToast({ title: 'Failed to create order. Please try again.' });
    }
  };

  const isBakoIdNft = useMemo(
    () => BAKO_CONTRACTS_IDS.includes(contractId!),
    [contractId]
  );

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
              <Text
                mt={3}
                fontSize="sm"
                color="section.500"
                wordBreak="break-all"
              >
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

            {!isBakoIdNft && isOwner && (
              <NftCardSaleForm
                onSubmit={handleCreateOrder}
                isLoading={isPending}
                assets={assets}
              />
            )}
            <NftListMetadata metadata={metadataArray} />
          </Stack>
        </Stack>

        <NftModal.CloseIcon onClose={onClose} />
      </NftModal.Content>
    </NftModal.Root>
  );
};
