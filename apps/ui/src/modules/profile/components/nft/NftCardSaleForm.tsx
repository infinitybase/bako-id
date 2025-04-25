import { CurrencyInput } from '@/components';
import { CloseIcon } from '@/components/icons/closeIcon';
import type { Asset } from '@/types/marketplace';
import { ETH_ID } from '@/utils/constants';
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
  useDisclosure,
} from '@chakra-ui/react';
import { isNaN as lodashIsNaN } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { NftSearchAssetModal } from './NftSearchAssetModal';

export type NftSaleCardForm = {
  sellAsset: {
    name: string;
    id: string;
    icon?: string;
  };
  sellPrice: number;
};

interface NftCardSaleFormProps {
  initialValues?: NftSaleCardForm;
  onSubmit: (data: NftSaleCardForm) => void;
  isLoading?: boolean;
  assets: Asset[];
}

export const NftCardSaleForm = ({
  initialValues,
  onSubmit,
  isLoading = false,
  assets,
}: NftCardSaleFormProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<NftSaleCardForm>({
    defaultValues: initialValues,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const findDefaultAsset = assets.find((asset) => asset.id === ETH_ID);
  const defaultAsset = {
    id: findDefaultAsset?.id,
    name: findDefaultAsset?.metadata?.name,
    icon: findDefaultAsset?.metadata?.icon,
  };

  const handleClearAmount = () => {
    setValue('sellPrice', 0);
  };

  return (
    <Grid
      as="form"
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
                    alt=""
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
              />
            </>
          )}
        />
      </GridItem>
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Controller
          control={control}
          name="sellPrice"
          defaultValue={0}
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
                <FormErrorMessage fontSize="sm">
                  {errors.sellPrice.message}
                </FormErrorMessage>
              )}
            </FormControl>
          )}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
        >
          List NFT
        </Button>
      </GridItem>
    </Grid>
  );
};
