import { useCustomToast } from '@/components';
import { useUpdateOrder } from '@/hooks/marketplace';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import type { Order } from '@/types/marketplace';
import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useCallback, useMemo } from 'react';
import { NftCardSaleForm, type NftSaleCardForm } from '../NftCardSaleForm';

export default function NftFormStep({
  assetSymbolUrl,
  order,
  value,
  onClose,
  name,
  onCancel,
  userWithHandle,
  ctaButtonVariant = 'primary',
}: {
  order: Order;
  value: number;
  assetSymbolUrl: string;
  onClose: () => void;
  name: string;
  onCancel: () => void;
  userWithHandle: boolean;
  ctaButtonVariant?: 'primary' | 'mktPrimary';
}) {
  const { updateOrderAsync, isPending } = useUpdateOrder();
  const { errorToast, successToast } = useCustomToast();
  const { assets } = useListAssets();

  const handleUpdateOrder = useCallback(
    async (data: NftSaleCardForm & { currentReceiveAmountInUsd: number }) => {
      try {
        const sellPrice = bn.parseUnits(
          data.sellPrice.toString(),
          data.sellAsset.decimals
        );

        const oldAmount = order.price.amount;
        const oldRaw = order.price.raw;
        const newAmount = Number(data.sellPrice);
        const newRaw = sellPrice.toString();

        const oldPrice = {
          oldAmount,
          oldRaw,
        };

        const newPrice = {
          newAmount,
          newRaw,
          usd: data.currentReceiveAmountInUsd,
        };

        await updateOrderAsync({
          oldPrice,
          newPrice,
          sellPrice,
          sellAsset: data.sellAsset.id,
          orderId: order.id,
        });
        successToast({ title: 'Order updated successfully!' });
        onClose();
      } catch {
        errorToast({ title: 'Failed to update order' });
      }
    },
    [updateOrderAsync, order, successToast, errorToast, onClose]
  );

  const decimals = useMemo(
    () => assets.find((a) => a.id === order.price.assetId)?.metadata?.decimals,
    [assets, order.price.assetId]
  );

  return (
    <Stack w="full" spacing={4}>
      <Heading>{name}</Heading>
      <Text color="grey.subtitle">
        Select new asset and price for your listing.
      </Text>
      <NftCardSaleForm
        onSubmit={handleUpdateOrder}
        assets={assets}
        userWithHandle={userWithHandle}
        initialValues={{
          sellAsset: {
            id: order.price.assetId,
            icon: assetSymbolUrl,
            name: order.price.name ?? 'Unknown',
            decimals,
          },
          sellPrice: value,
        }}
      />

      <Stack direction="row" justifyContent="space-between" mt="auto">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant={ctaButtonVariant}
          form="nft-sale-form"
          isLoading={isPending}
        >
          Save new price
        </Button>
      </Stack>
    </Stack>
  );
}
