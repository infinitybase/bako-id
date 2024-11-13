import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  Spinner,
  type InputProps,
} from '@chakra-ui/react';
import { Controller, type FieldErrors, type Control } from 'react-hook-form';
import type { CustomAutocompleteValue } from '../../modules/buy/hooks/useResolverForm';

interface IResolverAutocomplete extends InputProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  isValid: boolean;
  control: Control<CustomAutocompleteValue>;
  errors: FieldErrors<CustomAutocompleteValue>;
  isLoading: boolean;
  isSignLoading: boolean;
}

export const ResolverAutocomplete = ({
  handleChange,
  inputValue,
  isValid,
  control,
  errors,
  isLoading,
  isSignLoading,
  ...rest
}: IResolverAutocomplete) => {
  return (
    <Box w="full" h="full" display="flex" flexDirection="column">
      <FormControl
        isInvalid={
          !isSignLoading &&
          !isLoading &&
          (!isValid || !!errors.resolver?.message)
        }
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
            name="resolver"
            rules={{
              required: {
                value: true,
                message: `The Resolver can't be empty`,
              },
              minLength: {
                value: 66,
                message: 'Invalid address',
              },
            }}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                isDisabled={isLoading || isSignLoading}
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
                maxLength={66}
                errorBorderColor="error.500"
                h="48px"
                _focus={{ ring: 'none', outline: 'none', border: 'none' }}
                onChange={(e) => {
                  field.onChange(e);
                  handleChange(e);
                }}
                flex={1}
                sx={{ _placeholder: { color: 'grey.200' } }}
                {...rest}
              />
            )}
          />

          <FormLabel isTruncated fontWeight="normal" maxW="80%" fontSize="sm">
            Address
          </FormLabel>
        </InputGroup>

        <Box h={9} w="full">
          {isLoading &&
            !isSignLoading &&
            !errors.resolver?.message &&
            inputValue.length === 66 && (
              <FormHelperText
                w="full"
                display="flex"
                alignItems="center"
                pl={2}
                gap={2}
              >
                Validating <Spinner boxSize={3} />
              </FormHelperText>
            )}
          {!isLoading &&
            errors.resolver?.message &&
            inputValue.length >= 1 &&
            inputValue.length <= 66 && (
              <FormErrorMessage
                w="full"
                color="error.500"
                display="flex"
                alignItems="center"
                pl={2}
                gap={2}
              >
                {errors.resolver.message}
              </FormErrorMessage>
            )}
          {!isLoading &&
            errors.resolver?.message &&
            inputValue.length === 0 && (
              <FormErrorMessage
                w="full"
                color="error.500"
                display="flex"
                alignItems="center"
                pl={2}
                gap={2}
              >
                {errors.resolver.message}
              </FormErrorMessage>
            )}

          {!isLoading && !isValid && inputValue.length >= 66 && (
            <FormErrorMessage
              w="full"
              color="error.500"
              display="flex"
              alignItems="center"
              pl={2}
              gap={2}
            >
              Invalid address
            </FormErrorMessage>
          )}
        </Box>
      </FormControl>
    </Box>
  );
};
