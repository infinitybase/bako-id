import {
  Box,
  Input as ChakraInput,
  Icon,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
  type InputProps,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { FarcasterIcon, TwitterIcon } from '..';

interface CustomInputProps extends InputProps {
  value: string;
  isVerified: boolean;
  rightAddon: boolean;
  rightAddonName: string | ReactNode;
  rightAddonClick: () => void;
  variant: string;
}

const VerifiedAccountInput = (props: CustomInputProps) => {
  const {
    value,
    isVerified,
    rightAddon,
    rightAddonName,
    rightAddonClick,
    ...rest
  } = props;

  const variants = {
    twitter: {
      icon: TwitterIcon,
      color: 'white',
      bgColor: 'black',
      verify: () => {},
    },
    farcaster: {
      icon: FarcasterIcon,
      color: 'white',
      bgColor: '#7F5FC7',
      verify: () => {},
    },
  };

  const currentVariant = variants[props.variant as keyof typeof variants];

  return (
    <Box w="full" display="flex" alignItems="flex-end" flexDirection="column">
      <InputGroup>
        <InputLeftAddon
          bgColor={currentVariant.bgColor}
          borderColor="stroke.500"
          borderRight="none"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
          w="10%"
          px={6}
          color="section.500"
          borderLeftRadius="xl"
          position="relative"
        >
          <Icon
            color={currentVariant.color}
            as={currentVariant.icon}
            w={6}
            h={6}
          />
          <Text
            zIndex={1}
            left="100%"
            position="absolute"
            ml={2}
            color={isVerified ? 'green' : 'red'}
          >
            {isVerified ? 'Verified' : 'Unverified'}
          </Text>
        </InputLeftAddon>

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
          fontSize="xs"
          textAlign="end"
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
      {!isVerified && (
        <Text
          mt={1}
          mr={2}
          fontSize="xs"
          _hover={{
            cursor: 'pointer',
            color: 'button.500',
          }}
          onClick={() => currentVariant.verify()}
        >
          Verify now
        </Text>
      )}
    </Box>
  );
};

export { VerifiedAccountInput };
