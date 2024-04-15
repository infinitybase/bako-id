import {
  As,
  Box,
  Input as ChakraInput,
  Icon,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
  type InputProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CustomInputProps extends InputProps {
  value: string;
  iconColor: string;
  iconBgColor: string;
  isVerified: boolean;
  accountIcon: As | undefined;
  rightAddon: boolean;
  rightAddonName: string | ReactNode;
  rightAddonClick: () => void;
}

const VerifiedAccountInput = (props: CustomInputProps) => {
  const {
    value,
    isVerified,
    accountIcon,
    rightAddon,
    rightAddonName,
    rightAddonClick,
    iconBgColor,
    iconColor,
    ...rest
  } = props;
  return (
    <Box w="full" display="flex" alignItems="center">
      <InputGroup>
        <InputLeftAddon
          bgColor={iconBgColor}
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
          <Icon color={iconColor} as={accountIcon} w={6} h={6} />
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
    </Box>
  );
};

export { VerifiedAccountInput };
