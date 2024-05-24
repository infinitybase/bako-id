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
import { AddIcon } from '../icons/addIcon';
import { useSidebar } from '../sidebar/hooks/useSidebar';

interface CustomInputProps extends InputProps {
  value?: string;
  isVerified?: boolean;
  rightAddon: boolean;
  rightAddonName: string | ReactNode;
  variant: string;
}

const VerifiedAccountInput = (props: CustomInputProps) => {
  const { isMyDomain } = useSidebar();
  const { value, isVerified, rightAddon, rightAddonName, ...rest } = props;

  const variants = {
    twitter: {
      name: 'X',
      icon: TwitterIcon,
      color: 'white',
      bgColor: 'background.900',
      verify: () => {},
      add: () => {},
    },
    farcaster: {
      name: 'Farcaster',
      icon: FarcasterIcon,
      color: 'white',
      bgColor: '#7F5FC7',
      verify: () => {},
      add: () => {},
    },
  };

  const copyValueToClipboard = () => {
    navigator.clipboard.writeText(value!);
  };

  const currentVariant = variants[props.variant as keyof typeof variants];

  if (!isMyDomain && !isVerified) return;

  return (
    <Box w="full" display="flex" alignItems="flex-end" flexDirection="column">
      <InputGroup>
        <InputLeftAddon
          bgColor={currentVariant.bgColor}
          borderColor="stroke.500"
          border="none"
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
          {value && (
            <Text
              zIndex={1}
              left="100%"
              position="absolute"
              ml={2}
              color={isVerified ? '#00943B' : '#F05D48'}
            >
              {isVerified ? 'Verified' : 'Not verified'}
            </Text>
          )}
        </InputLeftAddon>

        <ChakraInput
          defaultValue={value ?? `Add ${currentVariant.name} account`}
          type="text"
          readOnly={true}
          h={10}
          pr={2}
          border="1px solid"
          borderColor="stroke.500"
          borderLeftColor="transparent"
          borderRightColor={rightAddon ? 'transparent' : 'stroke.500'}
          borderRadius="xl"
          backgroundColor="input.600"
          color="grey.100"
          fontSize={['xs', 'sm']}
          textAlign="end"
          fontWeight={500}
          _focus={{}}
          _hover={{}}
          {...rest}
        />
        {rightAddon && isVerified ? (
          <InputRightAddon
            bgColor="input.600"
            borderColor="stroke.500"
            borderLeftColor="transparent"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            w="2rem"
            color="section.500"
            borderRightRadius="xl"
            pr={4}
            _hover={{
              cursor: 'pointer',
              color: 'button.500',
            }}
            onClick={copyValueToClipboard}
          >
            {rightAddonName}
          </InputRightAddon>
        ) : (
          <InputRightAddon
            bgColor="input.600"
            borderColor="stroke.500"
            borderLeftColor="transparent"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            w="2rem"
            color="section.500"
            borderRightRadius="xl"
            pr={4}
            _hover={{
              cursor: 'pointer',
              color: 'button.500',
            }}
            onClick={currentVariant.add}
          >
            <AddIcon />
          </InputRightAddon>
        )}
      </InputGroup>
      {!isVerified && isMyDomain && (
        <Text
          mt={1}
          mr={2}
          fontSize="xs"
          _hover={{
            cursor: 'pointer',
            color: 'button.500',
          }}
          onClick={currentVariant.verify}
        >
          Verify now
        </Text>
      )}
    </Box>
  );
};

export { VerifiedAccountInput };
