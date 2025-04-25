import { EditIcon, useCustomToast } from '@/components';
import { BTCIcon } from '@/components/icons/btcicon';
import { ContractIcon } from '@/components/icons/contracticon';
import { useExecuteOrder, useUpdateOrder } from '@/hooks/marketplace';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import type { Nft } from '@/types/marketplace';
import { blocklistMetadataKeys, MarketPlaceErrors } from '@/utils/constants';
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { entries } from 'lodash';
import { useMemo, useState } from 'react';
import { NftModal } from './modal';
import { NftCardSaleForm, type NftSaleCardForm } from './NftCardSaleForm';
import { NftListMetadata } from './NftListMetadata';
import { NftMetadataBlock } from './NftMetadataBlock';

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
  onCancelOrder: () => Promise<void>;
  isCanceling?: boolean;
  isOwner: boolean;
}

export const NftSaleCardModal = ({
  isOpen,
  onClose,
  nft,
  name,
  imageUrl,
  onCancelOrder,
  isCanceling = false,
  asset,
  value,
  orderId,
  usdValue,
  isOwner,
}: NftSaleCardModalProps) => {
  const [isEditView, setIsEditView] = useState(false);
  const { updateOrderAsync, isPending } = useUpdateOrder();
  const { errorToast, successToast } = useCustomToast();
  const { assets } = useListAssets();
  const { executeOrderAsync, isPending: isExecuting } = useExecuteOrder();

  const handleExecuteOrder = async () => {
    try {
      await executeOrderAsync(orderId);
      successToast({ title: 'Order executed successfully!' });
      onClose();
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      const errors = Object.values(MarketPlaceErrors.executeOrder);
      const errorIndex = errors.findIndex((e) => e === err);
      const errorMessage =
        errorIndex !== -1
          ? errors[errorIndex]
          : MarketPlaceErrors.executeOrder.default;
      errorToast({ title: errorMessage });
    }
  };

  const metadataArray = useMemo(
    () =>
      entries(nft.metadata ?? {})
        .map(([key, value]) => ({
          label: key,
          value,
        }))
        .filter((item) => !blocklistMetadataKeys.includes(item.label)),
    [nft]
  );

  const handleUpdateOrder = async (data: NftSaleCardForm) => {
    try {
      await updateOrderAsync({
        sellPrice: bn.parseUnits(data.sellPrice.toString()),
        sellAsset: data.sellAsset.id,
        orderId,
      });
      successToast({ title: 'Order updated successfully!' });
      onClose();
    } catch {
      errorToast({ title: 'Failed to update order' });
    }
  };

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
                title="Token ID"
                value={nft.edition?.replace('#', '') ?? ''}
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

          {!isEditView && (
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

              {isOwner && (
                <IconButton
                  variant="icon"
                  aria-label="Edit order"
                  icon={<EditIcon />}
                  onClick={() => setIsEditView(true)}
                />
              )}
            </Stack>
          )}

          {isOwner && isEditView && (
            <NftCardSaleForm
              onSubmit={handleUpdateOrder}
              isLoading={isPending}
              assets={assets}
              initialValues={{
                sellAsset: {
                  id: asset.id,
                  icon: asset.iconUrl,
                  name: asset.name,
                },
                sellPrice: Number(value),
              }}
            />
          )}

          {isOwner && !isEditView && (
            <Button
              variant="tertiary"
              color="input.600"
              borderColor="error.600"
              py={4}
              onClick={onCancelOrder}
              isLoading={isCanceling}
            >
              Delist NFT
            </Button>
          )}

          {!isOwner && (
            <Button
              variant="primary"
              py={4}
              isLoading={isExecuting}
              onClick={handleExecuteOrder}
            >
              Buy
            </Button>
          )}

          <NftListMetadata metadata={metadataArray} />
        </Stack>

        <NftModal.CloseIcon onClose={onClose} />
      </NftModal.Content>
    </NftModal.Root>
  );
};
