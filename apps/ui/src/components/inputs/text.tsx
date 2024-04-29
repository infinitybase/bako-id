import {
  Box,
  Container,
  Input,
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
  wrapText?: boolean;
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
    wrapText,
    ...rest
  } = props;
  return (
    <Box w="full" alignItems="center">
      <InputGroup w="full">
        {leftAddon && (
          <InputLeftAddon
            h={inputHeight ?? 10}
            bgColor="input.600"
            borderColor="stroke.500"
            borderRight="none"
            alignItems="center"
            justifyContent="flex-start"
            fontSize="sm"
            w={leftAddonWidth ?? 'fit-content'}
            color={leftAddonColor ?? 'section.500'}
            borderLeftRadius="xl"
          >
            {leftAddonName}
          </InputLeftAddon>
        )}
        {wrapText ? (
          <Container
            w="full"
            alignItems="center"
            display="flex"
            h={inputHeight ?? 10}
            border="1px solid"
            borderColor="stroke.500"
            borderLeftColor={leftAddon ? 'transparent' : 'stroke.500'}
            borderRightColor={rightAddon ? 'transparent' : 'stroke.500'}
            backgroundColor="input.600"
            color={inputColor ?? 'grey.100'}
            fontSize={['xs', 'sm']}
            fontWeight={600}
            _focus={{
              borderColor: 'stroke.500',
              borderInlineColor: 'transparent',
            }}
            _hover={{}}
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            {...rest}
          >
            {value ?? ''}
          </Container>
        ) : (
          <Input
            w="full"
            defaultValue={value ?? ''}
            readOnly={true}
            alignItems="center"
            display="flex"
            h={inputHeight ?? 10}
            border="1px solid"
            borderColor="stroke.500"
            borderLeftColor={leftAddon ? 'transparent' : 'stroke.500'}
            borderRightColor={rightAddon ? 'transparent' : 'stroke.500'}
            backgroundColor="input.600"
            color={inputColor ?? 'grey.100'}
            fontSize="sm"
            fontWeight={600}
            _focus={{
              borderColor: 'stroke.500',
              borderInlineColor: 'transparent',
            }}
            _hover={{}}
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            {...rest}
          />
        )}

        {rightAddon && (
          <InputRightAddon
            h={inputHeight ?? 10}
            bgColor="input.600"
            borderColor="stroke.500"
            borderLeftColor="transparent"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            w={rightAddonWidth ?? '15%'}
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
