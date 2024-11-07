import { isValidDomain } from '@bako-id/sdk';
import { InfoIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  UnorderedList,
  type InputProps,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  AvailableBadge,
  BakoTooltip,
  NotSupportedBadge,
  SearchingBadge,
  UnavailableBadge,
} from '..';
import { useHome } from '../../modules/home/hooks';
import { CloseIcon } from '../icons/closeIcon';
import { SearchIcon } from '../icons/searchIcon';
import { useWallet } from '@fuels/react';

interface ICustomAutocomplete extends InputProps {}

type CustomAutocompleteValue = {
  handle: string;
};

export const CustomAutocomplete = (props: ICustomAutocomplete) => {
  const { handleChangeDomain, domainIsAvailable, handleConfirmDomain } =
    useHome();
  const [inputValue, setInputValue] = useState<string>('');
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomAutocompleteValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      handle: '',
    },
  });
  const onSubmit = () => {
    handleConfirmDomain();
  };

  const { wallet } = useWallet();
  console.log('waléti', wallet?.address.toB256());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Box w="full" h="full" display="flex" flexDirection="column">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          isInvalid={!!errors?.handle && inputValue.length >= 0}
          display="flex"
          flexDirection="column"
        >
          <InputGroup
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <Controller
              name="handle"
              control={control}
              defaultValue=""
              rules={{
                required: { value: true, message: 'You must type something' },
                minLength: {
                  value: 4,
                  message: 'Handle must be at least 3 characters long.',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="autocomplete"
                  value={inputValue}
                  color="white"
                  fontWeight="normal"
                  w="full"
                  fontSize="16px"
                  placeholder=""
                  autoComplete="off"
                  textColor="text.700"
                  background="input.900"
                  type="text"
                  maxLength={31}
                  errorBorderColor="error.500"
                  h="48px"
                  _focus={{ ring: 'none', outline: 'none', border: 'none' }}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange(e);
                  }}
                  flex={1}
                  sx={{ _placeholder: { color: 'grey.200' } }}
                  {...props}
                />
              )}
            />
            <FormLabel isTruncated fontWeight="normal" maxW="80%" fontSize="sm">
              Address
            </FormLabel>
          </InputGroup>
          <Box h={9} w="full">
            {errors.handle?.message && inputValue.length <= 3 && (
              <FormErrorMessage
                w="full"
                color="error.500"
                display="flex"
                alignItems="center"
                pl={2}
                gap={2}
              >
                {errors.handle.type === 'minLength' ? (
                  <BakoTooltip
                    w="full"
                    label={
                      <UnorderedList>
                        <ListItem>
                          Handle must be at least 3 characters and no longer
                          than 31.
                        </ListItem>
                        <ListItem>
                          Can be composed of letters, numbers, hyphens and
                          underlines.
                        </ListItem>
                        <ListItem>
                          No spaces or others special characters.
                        </ListItem>
                      </UnorderedList>
                    }
                  >
                    <InfoIcon w={3} h={3} color="section.200" mb={0.5} />
                  </BakoTooltip>
                ) : (
                  <Box />
                )}
                {errors.handle?.message}
              </FormErrorMessage>
            )}
          </Box>
        </FormControl>
      </form>
    </Box>
  );
};
