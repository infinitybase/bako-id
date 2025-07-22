import { Card, CurrencyInput } from '@/components';
import { CloseIcon } from '@/components/icons/closeIcon';
import type { Asset } from '@/types/marketplace';
import { FUEL_ASSET_ID } from '@/utils/constants';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { bn } from 'fuels';
import { isNaN as lodashIsNaN } from 'lodash';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NftSearchAssetModal } from './NftSearchAssetModal';
import SummaryFeeCard from './SummaryFeeCard';

export type NftSaleCardForm = {
  sellAsset: {
    name: string;
    id: string;
    icon?: string;
    decimals?: number;
  };
  sellPrice: number;
};

interface NftCardSaleFormProps {
  initialValues?: NftSaleCardForm;
  onSubmit: (data: NftSaleCardForm) => void;
  assets: Asset[];
  userWithHandle: boolean;
}

export const NftCardSaleForm = ({
  initialValues,
  onSubmit,
  assets,
  userWithHandle,
}: NftCardSaleFormProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<NftSaleCardForm>({
    defaultValues: initialValues,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sellAssetId = watch('sellAsset.id');

  const currentSellAsset = useMemo(
    () => assets.find((asset) => asset.id === sellAssetId),
    [assets, sellAssetId]
  );

  const findDefaultAsset = useMemo(
    () => assets.find((asset) => asset.id === FUEL_ASSET_ID),
    [assets]
  );
  const defaultAsset = {
    id: findDefaultAsset?.id,
    name: findDefaultAsset?.metadata?.name,
    icon: findDefaultAsset?.metadata?.icon,
    decimals: findDefaultAsset?.metadata?.decimals,
  };

  const handleClearAmount = () => {
    setValue('sellPrice', 0);
  };

  const userWithHandleFee = useMemo(() => {
    if (!currentSellAsset) return '0';
    return currentSellAsset.fees[1];
  }, [currentSellAsset]);

  const userWithoutHandleFee = useMemo(() => {
    if (!currentSellAsset) return '0';
    return currentSellAsset.fees[0];
  }, [currentSellAsset]);

  const currentFee = useMemo(() => {
    if (!currentSellAsset) return '0';
    return userWithHandle
      ? userWithHandleFee // User with handle pays the second fee
      : userWithoutHandleFee; // User without handle pays the first fee
  }, [
    currentSellAsset,
    userWithHandle,
    userWithHandleFee,
    userWithoutHandleFee,
  ]);

  const currentValue = watch('sellPrice');

  const valueToReceive = useMemo(() => {
    if (!currentSellAsset || !currentValue) return '0';

    const valueInBaseUnits = bn.parseUnits(
      currentValue.toString(),
      currentSellAsset.metadata?.decimals || 9
    );
    const feeAmount = valueInBaseUnits.mul(currentFee).div(10000);
    const valueAfterFee = valueInBaseUnits.sub(feeAmount);

    return valueAfterFee.formatUnits(currentSellAsset.metadata?.decimals || 9);
  }, [currentValue, currentSellAsset, currentFee]);

  const currentReceiveAmountInUsd = useMemo(() => {
    const valueToReceiveInNumber = Number(valueToReceive);
    if (!currentSellAsset || Number.isNaN(valueToReceiveInNumber)) return '-';
    const amount =
      (currentSellAsset?.metadata?.rate || 0) * valueToReceiveInNumber;
    return `~ ${amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })}`;
  }, [currentSellAsset, valueToReceive]);

  return (
    <Grid
      as="form"
      id="nft-sale-form"
      onSubmit={handleSubmit(onSubmit)}
      templateColumns="repeat(2, 1fr)"
      gap={4}
    >
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Controller
          control={control}
          name="sellAsset"
          // @ts-expect-error - Set eth to default asset
          defaultValue={defaultAsset}
          rules={{
            required: 'Asset is required',
          }}
          render={({ field }) => (
            <>
              <FormControl isInvalid={!!errors.sellAsset} position="relative">
                {field.value?.id && (
                  <Image
                    position="absolute"
                    left={3}
                    zIndex={99}
                    top="50%"
                    boxSize="18px"
                    src={field.value.icon}
                    alt={field.value.name}
                  />
                )}
                <InputGroup position="relative">
                  <Input
                    {...field}
                    readOnly
                    type="text"
                    variant="outlined"
                    onClick={onOpen}
                    value={field.value?.name}
                    onKeyUp={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.key === 'Enter') {
                        onOpen();
                      }
                    }}
                    placeholder=" "
                    size="lg"
                    pl={field.value?.id ? 10 : 5}
                    fontSize="xs"
                    cursor="pointer"
                  />
                  <ChevronDownIcon
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={99}
                  />
                </InputGroup>

                <FormLabel fontSize="sm">Asset</FormLabel>
                {errors.sellAsset && (
                  <FormErrorMessage fontSize="sm">
                    {errors.sellAsset.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <NftSearchAssetModal
                onClose={onClose}
                isOpen={isOpen}
                onSelect={field.onChange}
                userWithHandle={userWithHandle}
              />
            </>
          )}
        />
      </GridItem>
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Controller
          control={control}
          name="sellPrice"
          defaultValue={undefined}
          rules={{
            required: 'Amount is required',
            validate: {
              positive: (value) => {
                if (value <= 0) {
                  return 'Amount must be greater than 0';
                }
                return true;
              },
              IsNotNaN: (value) => {
                if (lodashIsNaN(value)) {
                  return 'Amount must be a number';
                }
                return true;
              },
            },
          }}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.sellPrice}>
              <InputGroup position="relative">
                <CurrencyInput
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  variant="outlined"
                  placeholder=" "
                  fontSize="xs"
                  type="text"
                  size="lg"
                  isInvalid={!!errors.sellPrice}
                />
                <InputRightElement
                  position="absolute"
                  right={1}
                  top="50%"
                  transform="translateY(-50%)"
                >
                  <IconButton
                    onClick={handleClearAmount}
                    size="xs"
                    variant="icon"
                    aria-label="Clear"
                  >
                    <CloseIcon height={2} width={2} />
                  </IconButton>
                </InputRightElement>
              </InputGroup>
              <FormLabel fontSize="sm">Amount</FormLabel>
              {errors.sellPrice && (
                <FormErrorMessage fontSize="xs" lineHeight=".1">
                  {errors.sellPrice.message}
                </FormErrorMessage>
              )}
            </FormControl>
          )}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SummaryFeeCard
          assetSymbol={currentSellAsset?.metadata?.symbol || 'FUEL'}
          currentFee={currentFee}
          currentValue={currentValue}
          currentReceiveAmountInUsd={currentReceiveAmountInUsd}
          valueToReceive={valueToReceive}
          isFuelToken={currentSellAsset?.id === FUEL_ASSET_ID}
        />
      </GridItem>

      {!userWithHandle && (
        <GridItem colSpan={2}>
          <Card
            p={4}
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={2}>
              <Text
                fontSize="md"
                fontWeight="bold"
              >{`Unlock ${bn(userWithHandleFee).formatUnits(2)}% fee`}</Text>
              <Text fontSize="sm" color="section.200">
                Turn your address into a Handle <br /> and get{' '}
                <Text as="span" color="button.500">
                  {`${bn(userWithHandleFee).formatUnits(2)}%`} trade fees
                </Text>
              </Text>
            </Stack>
            <Button variant="secondary" w="fit-content" as={Link} to="/">
              Get now
            </Button>
          </Card>
        </GridItem>
      )}
    </Grid>
  );
};
