import {
  Box,
  Input as ChakraInput,
  InputGroup,
  InputProps,
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
          h={12}
          border="1px solid"
          borderColor="stroke.500"
          borderRadius="lg"
          backgroundColor="background.900"
          color="white"
          fontSize={16}
          fontWeight={600}
        />
      </InputGroup>
    </Box>
  );
};

export { TextInput };
