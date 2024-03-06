import React, { useState } from "react";
import {
  Input as ChakraInput,
  FormHelperText,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/react';
// import { ErrorBadge, SuccessBadge } from '../helpers';

interface InputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string | undefined;
  available?: boolean;
}

export const SearchInput = ({
  onChange,
  errorMessage,
  available
}: InputProps) => {
  const [inputValue, setInputValue] = useState("");
  console.debug(available)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const newOne = e.target.value.replace(".fuel", "");
    // setInputValue(newOne + ".fuel");
    setInputValue(e.target.value.substring(0));
    onChange(e);
  };

  return (
    <>
      <InputGroup borderRightColor="transparent">
        <InputLeftAddon borderLeftColor="transparent" bgColor="background.400">
          @
        </InputLeftAddon>
        <ChakraInput
          value={inputValue}
          minW="12rem"
          w="full"
          color="white"
          borderRight="none"
          borderColor="whiteAlpha.50"
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
        {/*{inputValue.length > 3 && (*/}
        {/*  <InputRightElement*/}
        {/*    pointerEvents="none"*/}
        {/*    children={available ? <SuccessBadge /> : <ErrorBadge />}*/}
        {/*  />*/}
        {/*)}*/}

      </InputGroup>

      {errorMessage && (
        <FormHelperText color="error.500">{errorMessage}</FormHelperText>
      )}
    </>
  );
}
