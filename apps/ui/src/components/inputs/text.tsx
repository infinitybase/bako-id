import {
  Box,
  Input as ChakraInput,
  InputGroup,
  InputLeftAddon,
  type InputProps,
} from '@chakra-ui/react';

interface CustomInputProps extends InputProps {
  value?: string;
  leftAddon?: boolean;
  leftAddonName?: string;
}

const TextInput = (props: CustomInputProps) => {
  const { value, leftAddon, leftAddonName, ...rest } = props;
  return (
    <Box w="full" display="flex" alignItems="center">
      <InputGroup>
        {leftAddon && (
          <InputLeftAddon
            bgColor="input.600"
            borderColor="stroke.500"
            borderRight="none"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            w="10%"
            px={10}
            color="section.500"
            borderLeftRadius="xl"
          >
            {leftAddonName}
          </InputLeftAddon>
        )}
        <ChakraInput
          defaultValue={value ?? ''}
          type="text"
          readOnly={true}
          h={10}
          border="1px solid"
          borderColor="stroke.500"
          borderLeftColor="transparent"
          borderRadius="xl"
          backgroundColor="input.600"
          color="grey.100"
          fontSize="sm"
          fontWeight={600}
          _focus={{
            borderColor: 'section.500',
          }}
          _hover={{
            borderColor: 'section.500',
          }}
          {...rest}
        />
      </InputGroup>
    </Box>
  );
};

export { TextInput };
