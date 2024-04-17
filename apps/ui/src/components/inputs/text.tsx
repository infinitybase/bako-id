import {
  Box,
  Input as ChakraInput,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  type InputProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CustomInputProps extends InputProps {
  value?: string;
  leftAddon?: boolean;
  leftAddonName?: string | ReactNode;
  rightAddon?: boolean;
  rightAddonName?: string | ReactNode;
  rightAddonClick?: () => void;
}

const TextInput = (props: CustomInputProps) => {
  const {
    value,
    leftAddon,
    leftAddonName,
    rightAddon,
    rightAddonName,
    rightAddonClick,
    ...rest
  } = props;
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
            px={8}
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
          borderRightColor={rightAddon ? 'transparent' : 'stroke.500'}
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
        {rightAddon && (
          <InputRightAddon
            bgColor="input.600"
            borderColor="stroke.500"
            borderLeftColor="transparent"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            w="10%"
            color="section.500"
            borderRightRadius="xl"
            pr={4}
            _hover={{
              cursor: 'pointer',
              color: 'button.500',
            }}
            onClick={rightAddonClick}
          >
            {rightAddonName}
          </InputRightAddon>
        )}
      </InputGroup>
    </Box>
  );
};

export { TextInput };
