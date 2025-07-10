import { useCustomToast } from '@/components';
import { useUpdateOrder } from '@/hooks/marketplace';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useCallback } from 'react';
import { NftCardSaleForm, type NftSaleCardForm } from '../NftCardSaleForm';
import type { Order } from '@/types/marketplace';

export default function NftFormStep({
  assetSymbolUrl,
  order,
  value,
  onClose,
  name,
  onCancel,
  userWithHandle,
}: {
  order: Order;
  value: number;
  assetSymbolUrl: string;
  onClose: () => void;
  name: string;
  onCancel: () => void;
  userWithHandle: boolean;
}) {
  const { updateOrderAsync, isPending } = useUpdateOrder();
  const { errorToast, successToast } = useCustomToast();
  const { assets } = useListAssets();

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
          variant="primary"
          form="nft-sale-form"
          isLoading={isPending}
        >
          Save new price
        </Button>
      </Stack>
    </Stack>
  );
}
