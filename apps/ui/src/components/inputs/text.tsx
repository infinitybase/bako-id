import {
  Box,
  Input as ChakraInput,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  type InputProps,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface CustomInputProps extends InputProps {
  inputHeight?: number;
  inputColor?: string;
  value?: string;
  leftAddon?: boolean;
  leftAddonName?: string | ReactNode;
  leftAddonWidth?: string | string[];
  leftAddonColor?: string;
  rightAddon?: boolean;
  rightAddonName?: string | ReactNode;
  rightAddonClick?: () => void;
  rightAddonWidth?: string | string[];
  rightAddonColor?: string;
}

const TextInput = (props: CustomInputProps) => {
  const {
    value,
    inputHeight,
    inputColor,
    leftAddon,
    leftAddonName,
    leftAddonWidth,
    leftAddonColor,
    rightAddon,
    rightAddonName,
    rightAddonColor,
    rightAddonWidth,
    rightAddonClick,
    ...rest
  } = props;
  return (
    <Box w="full" display="flex" alignItems="center">
      <InputGroup>
        {leftAddon && (
          <InputLeftAddon
            h={inputHeight ?? 10}
            bgColor="input.600"
            borderColor="stroke.500"
            borderRight="none"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            w={leftAddonWidth ?? '15%'}
            px={8}
            color={leftAddonColor ?? 'section.500'}
            borderLeftRadius="xl"
          >
            {leftAddonName}
          </InputLeftAddon>
        )}
        <ChakraInput
          defaultValue={value ?? ''}
          type="text"
          readOnly={true}
          h={inputHeight ?? 10}
          border="1px solid"
          borderColor="stroke.500"
          borderLeftColor="transparent"
          borderRightColor={rightAddon ? 'transparent' : 'stroke.500'}
          borderRadius="xl"
          backgroundColor="input.600"
          color={inputColor ?? 'grey.100'}
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
            h={inputHeight ?? 10}
            bgColor="input.600"
            borderColor="stroke.500"
            borderLeftColor="transparent"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            w={rightAddonWidth ?? '10%'}
            color={rightAddonColor ?? 'section.500'}
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
