import UnknownAsset from '@/assets/unknown-asset.png';
import { EditIcon, LightIcon, UserIcon, useCustomToast } from '@/components';
import { BTCIcon } from '@/components/icons/btcicon';
import { ContractIcon } from '@/components/icons/contracticon';
import { ExchangeDolarIcon } from '@/components/icons/exchangeDolar';
import { useExecuteOrder, useUpdateOrder } from '@/hooks/marketplace';
import { useGetAsset } from '@/hooks/marketplace/useGetAsset';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { useAssetsBalance } from '@/hooks/useAssetsBalance';
import type { Order } from '@/types/marketplace';
import { blocklistMetadataKeys } from '@/utils/constants';
import { formatAddress } from '@/utils/formatter';
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useConnectUI } from '@fuels/react';
import { Link } from '@tanstack/react-router';
import { bn } from 'fuels';
import { entries } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { NftCardSaleForm, type NftSaleCardForm } from './NftCardSaleForm';
import { NftListMetadata } from './NftListMetadata';
import { NftMetadataBlock } from './NftMetadataBlock';
import { NftModal } from './modal';

interface NftSaleCardModalProps {
  order: Order;
  value: string;
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  usdValue: string;
  onCancelOrder: () => Promise<void>;
  isCanceling?: boolean;
  isOwner: boolean;
  withHandle: boolean;
}

export const NftSaleCardModal = ({
  order,
  isOpen,
  onClose,
  onCancelOrder,
  isCanceling = false,
  usdValue,
  imageUrl,
  isOwner,
  value,
  withHandle,
}: NftSaleCardModalProps) => {
  const [isEditView, setIsEditView] = useState(false);
  const { connect, isConnected } = useConnectUI();
  const { updateOrderAsync, isPending } = useUpdateOrder();
  const { errorToast, successToast } = useCustomToast();
  const { assets } = useListAssets();
  const { data: assetsBalance } = useAssetsBalance({ assets });
  const { executeOrderAsync, isPending: isExecuting } = useExecuteOrder();
  const { data: assetData, isLoading: isLoadingAsset } = useGetAsset(
    order.asset?.id || ''
  );

  const assetFee = useMemo(
    () => (withHandle ? assetData?.fees[1] : assetData?.fees[0]),
    [assetData, withHandle]
  );

  const currentSellAssetBalance = useMemo(
    () =>
      assetsBalance
        ?.find((item) => item.id === order.asset?.id)
        ?.balance.formatUnits(order.asset?.decimals),
    [assetsBalance, order.asset?.id, order.asset?.decimals]
  );

  const notEnoughBalance = useMemo(() => {
    if (!currentSellAssetBalance) return false;
    const parsedValue = Number.parseFloat(value);
    const parsedBalance = Number.parseFloat(currentSellAssetBalance);
    return parsedValue > parsedBalance;
  }, [currentSellAssetBalance, value]);

  const handleExecuteOrder = useCallback(async () => {
    if (!isConnected) {
      connect();
      onClose();
      return;
    }
    try {
      await executeOrderAsync(order.id);
      successToast({ title: 'Order executed successfully!' });
      onClose();
    } catch {
      errorToast({ title: 'Failed to execute order' });
    }
  }, [
    connect,
    executeOrderAsync,
    order.id,
    onClose,
    successToast,
    errorToast,
    isConnected,
  ]);

  const metadataArray = useMemo(
    () =>
      entries(order.nft.metadata ?? {})
        .map(([key, value]) => ({
          label: key,
          value,
        }))
        .filter((item) => !blocklistMetadataKeys.includes(item.label)),
    [order.nft.metadata]
  );

  const handleUpdateOrder = useCallback(
    async (data: NftSaleCardForm) => {
      try {
        await updateOrderAsync({
          sellPrice: bn.parseUnits(data.sellPrice.toString()),
          sellAsset: data.sellAsset.id,
          orderId: order.id,
        });
        successToast({ title: 'Order updated successfully!' });
        onClose();
      } catch {
        errorToast({ title: 'Failed to update order' });
      }
    },
    [updateOrderAsync, order.id, successToast, errorToast, onClose]
  );

  const nftName = order.nft?.name ?? 'Unknown NFT';

  const assetSymbolUrl = order.asset?.icon || UnknownAsset;

  const handle = order.sellerDomain
    ? `@${order.sellerDomain}`
    : formatAddress(order.seller);

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
        <NftModal.Image w="full" src={imageUrl} alt={nftName} />
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
          <Heading>{nftName}</Heading>
          <Stack spacing={2}>
            <Text>Description</Text>
            <Text fontSize="sm" color="grey.subtitle" wordBreak="break-all">
              {order.nft?.description ?? 'Description not provided.'}
            </Text>
          </Stack>

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {order.nft.id && (
              <GridItem>
                <NftMetadataBlock
                  title="Asset ID"
                  value={order.nft.id}
                  icon={<BTCIcon />}
                  isCopy
                />
              </GridItem>
            )}

            {order.nft.fuelMetadata?.collection && (
              <GridItem>
                <NftMetadataBlock
                  title="Creator"
                  value={order.nft.fuelMetadata?.collection}
                  icon={<LightIcon />}
                />
              </GridItem>
            )}

            <GridItem>
              <NftMetadataBlock
                title="Contract address"
                value={order.nft?.contractId ?? 'N/A'}
                icon={<ContractIcon />}
                isCopy
              />
            </GridItem>

            {handle && (
              <GridItem>
                <Link
                  to={`/profile/${order.sellerDomain ? order.sellerDomain : order.seller}`}
                >
                  <NftMetadataBlock
                    title="Seller"
                    value={handle}
                    icon={<UserIcon />}
                  />
                </Link>
              </GridItem>
            )}

            {(assetFee || isLoadingAsset) && (
              <GridItem>
                <Skeleton isLoaded={!isLoadingAsset} borderRadius="md">
                  <NftMetadataBlock
                    title="Application Fee"
                    value={`${bn(assetFee).formatUnits(2)}%`}
                    icon={<ExchangeDolarIcon />}
                  />
                </Skeleton>
              </GridItem>
            )}
          </Grid>

          {!isEditView && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex alignItems="center" gap={2}>
                <Image
                  src={assetSymbolUrl}
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
                  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                  id: order.asset?.id!,
                  icon: assetSymbolUrl,
                  name: order.asset?.name ?? 'Unknown',
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
            <Tooltip label={notEnoughBalance ? 'Not enough balance' : ''}>
              <Button
                variant="primary"
                py={4}
                isLoading={isExecuting}
                disabled={notEnoughBalance}
                onClick={handleExecuteOrder}
              >
                Buy
              </Button>
            </Tooltip>
          )}

          <NftListMetadata metadata={metadataArray} />
        </Stack>

        <NftModal.CloseIcon onClose={onClose} />
      </NftModal.Content>
    </NftModal.Root>
  );
};
