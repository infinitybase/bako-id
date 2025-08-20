import UnknownAsset from '@/assets/unknown-asset.png';
import { EditIcon, LightIcon, UserIcon, useCustomToast } from '@/components';
import { BTCIcon } from '@/components/icons/btcicon';
import { CloseIcon } from '@/components/icons/closeIcon';
import { ContractIcon } from '@/components/icons/contracticon';
import { useResolverName } from '@/hooks';
import { useExecuteOrder } from '@/hooks/marketplace';
import type { OrderWithMedatada } from '@/types/marketplace';
import { formatAddress } from '@/utils/formatter';
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Image,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useAccount, useBalance, useConnectUI } from '@fuels/react';
import { Link } from '@tanstack/react-router';
import { bn } from 'fuels';
import { useCallback, useMemo } from 'react';
import { NftListMetadata } from '../NftListMetadata';
import { NftMetadataBlock } from '../NftMetadataBlock';
import ShareOrder from '../ShareOrder';
import { getHomeUrl } from '@/utils/getHomeUrl';

export default function NftDetailsStep({
  onClose,
  order,
  value,
  isOwner,
  usdValue,
  onCancelOrder,
  isCanceling = false,
  onEdit,
  ctaButtonVariant,
}: {
  order: OrderWithMedatada;
  onClose: () => void;
  value: number;
  isOwner: boolean;
  usdValue: string;
  onCancelOrder: () => Promise<void>;
  isCanceling?: boolean;
  onEdit: () => void;
  ctaButtonVariant?: 'primary' | 'mktPrimary';
}) {
  const { connect, isConnected } = useConnectUI();
  const { errorToast, successToast } = useCustomToast();
  const { account } = useAccount();
  const homeUrl = getHomeUrl();

  const {
    balance: walletAssetBalance,
    isLoading: isLoadingWalletBalance,
    isFetching: isFetchingBalance,
  } = useBalance({
    address: account,
    assetId: order.price.assetId,
  });

  const { executeOrderAsync, isPending: isExecuting } = useExecuteOrder(
    order.collection?.address ?? ''
  );
  const { data: sellerDomain, isLoading: isLoadingDomain } = useResolverName(
    order.seller
  );

  const notEnoughBalance = useMemo(() => {
    if (isLoadingWalletBalance || !walletAssetBalance) return true;
    return walletAssetBalance.lt(bn(order.price.raw));
  }, [walletAssetBalance, isLoadingWalletBalance, order.price.raw]);

  const handleExecuteOrder = useCallback(async () => {
    if (!isConnected) {
      connect();
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

  const attributes = Array.isArray(order.asset?.metadata.attributes)
    ? order.asset?.metadata.attributes
    : [];

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
      position="relative"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        w="full"
        position={{
          base: 'relative',
          sm: 'sticky',
        }}
        bg="background.900"
        top={0}
        right={0}
        zIndex={1}
      >
        <Heading>{nftName}</Heading>
        <Icon as={CloseIcon} cursor="pointer" onClick={onClose} />
      </Flex>

      <Stack spacing={2}>
        <Text>Description</Text>
        <Text fontSize="sm" color="grey.subtitle" wordBreak="break-all">
          {order.asset?.metadata?.description ?? 'Description not provided.'}
        </Text>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Tooltip label={order.asset?.name}>
            <Image src={assetSymbolUrl} alt="Asset icon" height={6} width={6} />
          </Tooltip>
          <Text fontSize="sm" color="grey.title" fontWeight="semibold">
            {value}
          </Text>
          <Text fontSize="sm" color="grey.subtitle">
            ~ {usdValue}
          </Text>
          {isOwner && (
            <IconButton
              variant="icon"
              aria-label="Edit order"
              icon={<EditIcon />}
              onClick={() => onEdit()}
            />
          )}
        </Flex>

        <ShareOrder
          orderId={order.id}
          nftName={order.asset?.name ?? 'Unknown NFT'}
          collectionName={order.collection?.name ?? ''}
        />
      </Stack>

      {isOwner && (
        <Button
          variant="tertiary"
          color="input.600"
          borderColor="error.600"
          py={4}
          onClick={onCancelOrder}
          isLoading={isCanceling}
          _hover={{
            bg: 'tertiary',
          }}
        >
          Delist NFT
        </Button>
      )}

      {!isOwner && (
        <Skeleton
          isLoaded={!isLoadingWalletBalance && !isFetchingBalance}
          borderRadius="md"
        >
          <Tooltip
            label={notEnoughBalance && isConnected ? 'Not enough balance' : ''}
          >
            <Button
              variant={ctaButtonVariant}
              py={4}
              isLoading={isExecuting}
              disabled={(notEnoughBalance && isConnected) || isExecuting}
              onClick={handleExecuteOrder}
            >
              Buy
            </Button>
          </Tooltip>
        </Skeleton>
      )}

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
            <Link
              to={`${homeUrl}profile/${sellerDomain ? sellerDomain : order.seller}`}
            >
              <NftMetadataBlock
                title="Seller"
                value={handle as string}
                icon={<UserIcon />}
              />
            </Link>
          </Skeleton>
        </GridItem>
      </Grid>

      <NftListMetadata
        metadata={attributes.map((a) => ({
          label: a.trait_type,
          value: a.value,
        }))}
      />
    </Stack>
  );
}
