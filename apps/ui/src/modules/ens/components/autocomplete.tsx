import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  type InputProps,
} from '@chakra-ui/react';
import { Controller, type Control } from 'react-hook-form';
import type { NSAutocompleteValue } from './dialog';

interface INSAutocomplete extends InputProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  isValid: boolean;
  control: Control<NSAutocompleteValue>;
  isLoading: boolean;
}

export const NSAutocomplete = ({
  handleChange,
  inputValue,
  control,
  isLoading,
  isValid,
  ...rest
}: INSAutocomplete) => {
  return (
    <Box w="full" display="flex" flexDirection="column">
      <FormControl isInvalid={!isValid} display="flex" flexDirection="column">
        <InputGroup
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Controller
            name="ens"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                isDisabled={isLoading}
                variant="autocomplete"
                value={inputValue}
                color="white"
                fontWeight="normal"
                w="full"
                fontSize="16px"
                placeholder=""
                autoComplete="off"
                textColor="text.700"
                background="input.600"
                type="text"
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
            ENS username
          </FormLabel>
          {isLoading && (
            <InputRightElement mt={1}>
              <Spinner boxSize={3} />
            </InputRightElement>
          )}
        </InputGroup>

        <Box h={8} w="full">
          {!isValid && (
            <FormErrorMessage
              w="full"
              color="error.500"
              display="flex"
              alignItems="center"
              pl={2}
              gap={2}
            >
              ENS not found
            </FormErrorMessage>
          )}
        </Box>
      </FormControl>
    </Box>
  );
};
