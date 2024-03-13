import React, { useState } from "react";
import {
  Input as ChakraInput,
  FormHelperText,
  InputGroup,
  InputLeftAddon, InputRightElement
} from '@chakra-ui/react';
import { UnavailableBadge, AvailableBadge } from '../helpers';

interface InputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string | undefined;
  available?: boolean | null;
}

export const SearchInput = ({
  onChange,
  errorMessage,
  available
}: InputProps) => {
  const [inputValue, setInputValue] = useState("");
  console.debug(available)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.substring(0));
    onChange(e);
  };

  return (
    <>
      <InputGroup borderRightColor="transparent" border="none">
        <InputLeftAddon borderLeftColor="transparent" bgColor="background.400" color="white" border="none">
          @
        </InputLeftAddon>
        <ChakraInput
          value={inputValue}
          minW="12rem"
          w="full"
          color="white"
          borderRight="none"
          borderColor="whiteAlpha.50"
          placeholder="Search for a name"
          textColor="text.700"
          background="background.400"
          type="text"
          errorBorderColor="error.500"
          onChange={handleChange}
          border="none"
          borderRadius={10}
          sx={{ _placeholder: { color: "text.500" } }}
          _focus={{}}
          _hover={{}}
          _focusVisible={{}}
        />
        {available !== null && (
          <InputRightElement
            pointerEvents="none"
            children={available ? <AvailableBadge /> : <UnavailableBadge />}
          />
        )}

      </InputGroup>

      {errorMessage && (
        <FormHelperText color="error.500">{errorMessage}</FormHelperText>
      )}
    </>
  );
}
