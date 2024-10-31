import {
  Box,
  Icon,
  InputGroup,
  InputLeftAddon,
  type InputProps,
  InputRightAddon,
  Text,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import {
  DiscordIcon,
  FarcasterIcon,
  GithubIcon,
  LocationIcon,
  TelegramIcon,
  TwitterIcon,
  WebsiteIcon,
} from '..';
import { AddIcon } from '../icons/addIcon';
import { useSidebar } from '../sidebar/hooks/useSidebar';

interface CustomInputProps extends InputProps {
  value?: string;
  isVerified?: boolean;
  rightAddon: boolean;
  rightAddonName: string | ReactNode;
  variant: { key: string; value: string };
}

const VerifiedAccountInput = (props: CustomInputProps) => {
  const { isMyDomain } = useSidebar();
  const { value, variant, isVerified, rightAddon, rightAddonName, ...rest } =
    props;

  const variants = {
    twitter: {
      name: 'X',
      value: props.value,
      icon: TwitterIcon,
      color: 'white',
      bgColor: 'background.900',
      verify: () => {},
      add: () => {},
    },
    farcaster: {
      name: 'Farcaster',
      value: props.value,
      icon: FarcasterIcon,
      color: 'white',
      bgColor: '#7F5FC7',
      verify: () => {},
      add: () => {},
    },
    discord: {
      name: 'Discord',
      value: props.value,
      icon: DiscordIcon,
      color: 'white',
      bgColor: '#5A58D8',
      verify: () => {},
      add: () => {},
    },
    github: {
      name: 'Github',
      value: props.value,
      icon: GithubIcon,
      color: 'black',
      bgColor: '#F5F5F5',
      verify: () => {},
      add: () => {},
    },
    location: {
      name: 'Location',
      value: props.value,
      icon: LocationIcon,
      color: 'white',
      bgColor: '#00943B',
      verify: () => {},
      add: () => {},
    },
    website: {
      name: 'Website',
      value: props.value,
      icon: WebsiteIcon,
      color: 'white',
      bgColor: '#F05D48',
      verify: () => {},
      add: () => {},
    },
    telegram: {
      name: 'Telegram',
      value: props.value,
      icon: TelegramIcon,
      color: 'white',
      bgColor: '#2EABEB',
      verify: () => {},
      add: () => {},
    },
  };

  const copyValueToClipboard = () => {
    navigator.clipboard.writeText(value!);
  };

  const currentVariant = variants[variant.key as keyof typeof variants];

  if (!isMyDomain && !isVerified) return;
  const isVerifiedVariant =
    currentVariant?.name === 'Farcaster' || currentVariant?.name === 'X';

  if (currentVariant) {
    return (
      <Box w="full" display="flex" alignItems="flex-end" flexDirection="column">
        <InputGroup>
          <InputLeftAddon
            bgColor={currentVariant?.bgColor}
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
              color={currentVariant?.color}
              as={currentVariant?.icon}
              w={6}
              h={6}
            />
            {currentVariant?.value && isVerifiedVariant && (
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

          <Box
            type="text"
            w="full"
            h="full"
            pr={2}
            display="flex"
            alignItems="center"
            justifyContent="end"
            border="1px solid"
            borderColor="stroke.500"
            borderLeftColor="transparent"
            borderRightColor={rightAddon ? 'transparent' : 'stroke.500'}
            backgroundColor="input.600"
            color="grey.100"
            fontSize={['xs', 'sm']}
            textAlign="end"
            fontWeight={500}
            _focus={{}}
            _hover={{}}
            {...rest}
          >
            {currentVariant?.value ?? `Add ${currentVariant?.name} account`}
          </Box>
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
  }
};

export { VerifiedAccountInput };
