import UnknownAsset from '@/assets/unknown-asset.png';
import { EditIcon, LightIcon, UserIcon, useCustomToast } from '@/components';
import { BTCIcon } from '@/components/icons/btcicon';
import { ContractIcon } from '@/components/icons/contracticon';
import { useResolverName } from '@/hooks';
import { useExecuteOrder } from '@/hooks/marketplace';
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
import { useCallback, useMemo } from 'react';
import { NftListMetadata } from '../NftListMetadata';
import { NftMetadataBlock } from '../NftMetadataBlock';
import type { Order } from '@/types/marketplace';
import { useGetWalletBalance } from '@/modules/marketplace/hooks/useGetWalletBalance';
import { bn } from 'fuels';

export default function NftDetailsStep({
  onClose,
  order,
  value,
  isOwner,
  usdValue,
  onCancelOrder,
  isCanceling = false,
  onEdit,
}: {
  order: Order;
  onClose: () => void;
  value: number;
  isOwner: boolean;
  usdValue: string;
  onCancelOrder: () => Promise<void>;
  isCanceling?: boolean;
  onEdit: () => void;
}) {
  const { connect, isConnected } = useConnectUI();
  const { errorToast, successToast } = useCustomToast();
  const { data: walletBalance, isLoading: isLoadingWalletBalance } =
    useGetWalletBalance();

  const { executeOrderAsync, isPending: isExecuting } = useExecuteOrder(
    order.seller
  );
  const { data: sellerDomain, isLoading: isLoadingDomain } = useResolverName(
    order.seller
  );

  const walletAssetBalance = walletBalance?.balances
    .find((balance) => balance.assetId === order.price.assetId)
    ?.amount.toString();

  const notEnoughBalance = useMemo(() => {
    if (isLoadingWalletBalance) return false;
    return !bn(walletAssetBalance).gte(order.price.raw.toString());
  }, [walletAssetBalance, isLoadingWalletBalance, order.price.raw]);

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

  const nftName = order.asset?.name ?? 'Unknown NFT';

  const assetSymbolUrl = order.price.image || UnknownAsset;

  const handle = sellerDomain
    ? `@${sellerDomain}`
    : formatAddress(order.seller);

  return (
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
          {order.asset?.metadata?.description ?? 'Description not provided.'}
        </Text>
      </Stack>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        {order.asset.id && (
          <GridItem>
            <NftMetadataBlock
              title="Asset ID"
              value={order.asset.id}
              icon={<BTCIcon />}
              isCopy
            />
          </GridItem>
        )}

        {order.collection?.name && (
          <GridItem>
            <NftMetadataBlock
              title="Creator"
              value={order.collection.name}
              icon={<LightIcon />}
            />
          </GridItem>
        )}

        <GridItem>
          <NftMetadataBlock
            title="Contract address"
            value={order.collection?.address ?? 'N/A'}
            icon={<ContractIcon />}
            isCopy
          />
        </GridItem>

        <GridItem>
          <Skeleton isLoaded={!isLoadingDomain} borderRadius="md">
            <Link to={`/profile/${sellerDomain ? sellerDomain : order.seller}`}>
              <NftMetadataBlock
                title="Seller"
                value={handle as string}
                icon={<UserIcon />}
              />
            </Link>
          </Skeleton>
        </GridItem>
      </Grid>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Image src={assetSymbolUrl} alt="Asset icon" height={6} width={6} />
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
            onClick={() => onEdit()}
          />
        )}
      </Stack>

      {isOwner && (
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
        <Skeleton isLoaded={!isLoadingWalletBalance} borderRadius="md">
          <Tooltip label={notEnoughBalance ? 'Not enough balance' : ''}>
            <Button
              variant="primary"
              py={4}
              isLoading={isExecuting}
              disabled={notEnoughBalance || isExecuting}
              onClick={handleExecuteOrder}
            >
              Buy
            </Button>
          </Tooltip>
        </Skeleton>
      )}

      <NftListMetadata metadata={order?.asset?.metadata.attributes} />
    </Stack>
  );
}
