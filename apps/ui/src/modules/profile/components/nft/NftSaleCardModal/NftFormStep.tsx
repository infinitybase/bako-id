import { useCustomToast } from '@/components';
import { useUpdateOrder } from '@/hooks/marketplace';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import type { Order } from '@/types/marketplace';
import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useCallback } from 'react';
import { NftCardSaleForm, type NftSaleCardForm } from '../NftCardSaleForm';

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
  value: string;
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
    <Stack w="full" spacing={6}>
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            id: order.asset?.id!,
            icon: assetSymbolUrl,
            name: order.asset?.name ?? 'Unknown',
          },
          // TODO: fix this value type
          sellPrice: value as unknown as number, // prevent broken js bilion number
        }}
      />

      <Stack
        direction="row"
        spacing={6}
        justifyContent="space-between"
        mt="auto"
      >
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
