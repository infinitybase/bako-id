import React, { useState } from "react";
import {
  Input as ChakraInput,
  Box,
  FormControl,
  FormHelperText,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ErrorBadge, SuccessBadge } from '../helpers';

interface InputProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maskText?: string;
  errorMessage: string;
  available?: boolean;
}

export const DomainsInput = ({
  placeholder,
  onChange,
  errorMessage,
  available
}: InputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const newOne = e.target.value.replace(".fuel", "");
    // setInputValue(newOne + ".fuel");
    setInputValue(e.target.value);
    onChange(e);
  };

  return (
    <Box w="full" display="flex" alignItems="center">
      <FormControl isInvalid={!!errorMessage} flex="1">
        <InputGroup>
          <ChakraInput
            value={inputValue}
            placeholder={placeholder}
            type="text"
            outline={"none"}
            errorBorderColor="error.500"
            onChange={handleChange}
            border="none"
            focusBorderColor={errorMessage ? "error.500" : "transparent"}
            backgroundColor="input.500"
            color="white"
            borderRadius={10}
            sx={{ _placeholder: { color: "text.500" } }}
            // as={InputMask}
            // mask={mask}
            // maskChar={null}
          />
          (
          {available !== undefined && (
            <InputRightElement
              pointerEvents="none"
              children={available ? <SuccessBadge /> : <ErrorBadge />}
            />
          )}
          )
        </InputGroup>

        {errorMessage && (
          <FormHelperText color="error.500">{errorMessage}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
}
