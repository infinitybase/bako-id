import {
  Input as ChakraInput,
  Box,
  InputGroup,
  type InputProps,
} from '@chakra-ui/react';

interface CustomInputProps extends InputProps {
  value?: string;
}

const TextInput = ({ value }: CustomInputProps) => {
  return (
    <Box w="full" display="flex" alignItems="center">
      <InputGroup>
        <ChakraInput
          defaultValue={value ?? ''}
          type="text"
          readOnly={true}
          border="none"
          borderRadius={10}
          backgroundColor="input.500"
          color="white"
          fontSize={16}
          fontWeight={600}
        />
      </InputGroup>
    </Box>
  );
};

export { TextInput };
