import { useCustomToast } from '@/components';
import { useCreateOrder } from '@/hooks/marketplace';
import type { Asset } from '@/types/marketplace';
import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { bn } from 'fuels';
import { useCallback } from 'react';
import { NftCardSaleForm, type NftSaleCardForm } from '../NftCardSaleForm';

export default function NftFormStep({
  name,
  assetId,
  onClose,
  onCancel,
  userWithHandle,
  assets,
  ctaButtonVariant = 'primary',
  nftImage,
}: {
  name: React.ReactNode;
  assetId: string;
  onClose: () => void;
  userWithHandle: boolean;
  onCancel: () => void;
  assets: Asset[];
  ctaButtonVariant?: 'primary' | 'mktPrimary';
  nftImage: string;
}) {
  const { createOrderAsync, isPending } = useCreateOrder();
  const { errorToast, successToast } = useCustomToast();

  const handleCreateOrder = useCallback(
    async (data: NftSaleCardForm) => {
      try {
        await createOrderAsync({
          itemAsset: assetId,
          itemAmount: bn(1),
          sellPrice: bn.parseUnits(
            data.sellPrice.toString(),
            data.sellAsset.decimals
          ),
          sellAsset: data.sellAsset.id,
          image: nftImage,
        });
        successToast({ title: 'Order created successfully!' });
        onClose();
      } catch (e) {
        const insufficientFundsError =
          e instanceof Error && e?.message?.includes('Insufficient funds');
        errorToast({
          title: insufficientFundsError
            ? 'Insufficient funds'
            : 'Failed to create order. Please try again.',
          description: insufficientFundsError
            ? 'Not enough ethereum to cover the transaction fee'
            : undefined,
        });
      }
    },
    [assetId, createOrderAsync, errorToast, onClose, successToast, nftImage]
  );

  return (
    <Stack w="full" spacing={4} h="480px">
      <Heading>{name}</Heading>

      <Text color="grey.subtitle">
        Select asset and enter price for your new listing.
      </Text>

      <NftCardSaleForm
        assets={assets}
        onSubmit={handleCreateOrder}
        userWithHandle={userWithHandle}
      />

      <Stack direction="row" justifyContent="space-between" mt="auto">
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          isDisabled={isPending}
          _hover={{
            borderColor: 'garage.100',
            color: 'garage.100',
          }}
        >
          Cancel
        </Button>
        <Button
          variant={ctaButtonVariant}
          type="submit"
          form="nft-sale-form"
          isLoading={isPending}
        >
          Confirm listing
        </Button>
      </Stack>
    </Stack>
  );
}
