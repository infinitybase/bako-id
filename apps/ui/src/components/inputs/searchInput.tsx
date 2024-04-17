import { SearchIcon } from '@chakra-ui/icons';
import {
  Input as ChakraInput,
  FormHelperText,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';
import { AvailableBadge, UnavailableBadge } from '../helpers';

interface InputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string | undefined;
  available?: boolean | null;
}

export const SearchInput = ({
  onChange,
  errorMessage,
  available,
}: InputProps) => {
  const [inputValue, setInputValue] = useState('');
  console.debug(available);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.substring(0));
    onChange(e);
  };

  return (
    <>
      <InputGroup>
        <ChakraInput
          value={inputValue}
          color="white"
          h={12}
          placeholder="Search for an available Handles"
          textColor="text.700"
          background="input.900"
          type="text"
          errorBorderColor="error.500"
          onChange={handleChange}
          border="1px solid"
          borderColor="grey.500"
          borderRadius={10}
          sx={{ _placeholder: { color: 'grey.200' } }}
          _focus={{}}
          _hover={{}}
          _focusVisible={{}}
        />
        {available !== null && (
          <InputRightElement h={12} pointerEvents="none">
            {available ? <AvailableBadge /> : <UnavailableBadge />}
          </InputRightElement>
        )}
        {available === null && (
          <InputRightElement h={12}>
            {<SearchIcon h={5} w={5} mr={[1, 4]} color="grey.100" />}
          </InputRightElement>
        )}
      </InputGroup>

      {errorMessage && (
        <FormHelperText color="error.500">{errorMessage}</FormHelperText>
      )}
    </>
  );
};
