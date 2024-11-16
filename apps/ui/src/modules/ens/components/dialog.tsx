import { MetadataKeys } from '@bako-id/sdk';
import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  Icon,
  type ModalProps,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Dialog } from '../../../components/dialog';
import {
  BlueWarningIcon,
  DiscordIcon,
  GithubIcon,
  MailIcon,
  TelegramIcon,
  TwitterIcon,
  UserIcon,
  WebsiteIcon,
} from '../../../components/icons';
import { type MetadataKeyValue, useMetadata } from '../../../hooks/useMetadata';
import { useENSForm } from '../hooks/useENSForm';
import { ENSMetadataKeys } from '../services';
import { NSAutocomplete } from './autocomplete';

const ensMetadata = {
  [ENSMetadataKeys.AVATAR]: {
    key: MetadataKeys.AVATAR,
    title: 'Avatar',
    icon: <UserIcon w={7} h={7} />,
  },
  [ENSMetadataKeys.SOCIAL_X]: {
    key: MetadataKeys.SOCIAL_X,
    title: 'X',
    icon: <TwitterIcon w={7} h={7} />,
  },
  [ENSMetadataKeys.SOCIAL_GITHUB]: {
    key: MetadataKeys.SOCIAL_GITHUB,
    title: 'Github',
    icon: <GithubIcon w={7} h={7} />,
  },
  [ENSMetadataKeys.SOCIAL_DISCORD]: {
    key: MetadataKeys.SOCIAL_DISCORD,
    title: 'Discord',
    icon: <DiscordIcon w={7} h={7} />,
  },
  [ENSMetadataKeys.SOCIAL_TELEGRAM]: {
    key: MetadataKeys.SOCIAL_TELEGRAM,
    title: 'Telegram',
    icon: <TelegramIcon w={7} h={7} />,
  },
  [ENSMetadataKeys.CONTACT_WEBSITE]: {
    key: MetadataKeys.CONTACT_WEBSITE,
    title: 'Website',
    icon: <WebsiteIcon w={7} h={7} />,
  },
  [ENSMetadataKeys.CONTACT_NICKNAME]: {
    key: MetadataKeys.CONTACT_NICKNAME,
    title: 'Nickname',
    icon: <UserIcon w={7} h={7} />,
  },
  [ENSMetadataKeys.CONTACT_EMAIL]: {
    key: MetadataKeys.CONTACT_EMAIL,
    title: 'E-mail',
    icon: <MailIcon w={7} h={7} />,
  },
};

export type NSAutocompleteValue = {
  ens: string;
};

export type ENSMetadataCardProps = {
  icon: ReactNode;
  title: string;
  metadataKey: MetadataKeys;
  value?: string;
  isLoading?: boolean;
};

const ENSMetadataCard = ({
  icon,
  title,
  value,
  isLoading,
  metadataKey,
}: ENSMetadataCardProps) => {
  if (isLoading) {
    return <Skeleton rounded="lg" w={['8.5rem', '8.8rem']} h="8rem" />;
  }

  const isAvatar = metadataKey === MetadataKeys.AVATAR;

  return (
    <Box
      w={['8.5rem', '8.8rem']}
      h="8rem"
      display="flex"
      flexDirection="row"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundImage={value && isAvatar ? value : undefined}
      backgroundColor={value && !isAvatar ? 'input.600' : 'input.900'}
      alignItems="center"
      justifyContent="center"
      rounded="xl"
      position="relative"
      border="1.5px solid"
      borderColor={value ? 'button.500' : 'input.600'}
    >
      <Flex
        maxW="full"
        w="full"
        hidden={!!value && isAvatar}
        flexDir="column"
        align="center"
        gap={2}
        justify="center"
        color={value ? 'section.200' : 'grey.400'}
      >
        {icon}
        <Tooltip placement="bottom" label={value}>
          <Center maxW="full" flexDirection="column">
            <Text key={title}>{title}</Text>
            <Text
              px={2}
              maxW="full"
              key={value}
              fontSize="xs"
              fontWeight="bold"
              isTruncated
            >
              {isAvatar ? ' ' : value || ' '}
            </Text>
          </Center>
        </Tooltip>
      </Flex>
    </Box>
  );
};

export interface NSDialogProps extends Omit<ModalProps, 'children'> {}

export const NSDialog = ({ isOpen, onClose, ...rest }: NSDialogProps) => {
  const {
    ensData,
    inputValue,
    control,
    handleInputChange,
    isLoading,
    ensName,
    setEnsName,
    setInputValue,
  } = useENSForm();

  const handleOnSuccess = () => {
    onClose();
    setUpdatedMetadata([]);
    setEnsName('');
    setInputValue('');
  };

  const { handleSaveRequest, setUpdatedMetadata } =
    useMetadata(handleOnSuccess);

  const handleClose = () => {
    setEnsName('');
    setInputValue('');
    onClose();
  };

  const formattedMetadata: MetadataKeyValue[] | null = ensData
    ? Object.entries(ensData).map(([key, value]) => ({
        key: key as MetadataKeys,
        value,
      }))
    : null;

  const handleConfirmAction = () => {
    if (formattedMetadata) {
      setUpdatedMetadata(formattedMetadata);
      handleSaveRequest.mutate();
    }
  };

  const disableAction = !isLoading && !ensData;

  const isValid = !(!isLoading && !ensData && ensName);

  return (
    <Dialog.Modal
      {...rest}
      motionPreset="slideInBottom"
      modalTitle="Import account from ENS"
      modalSubtitle="Set your ENS username below and confirm the import."
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      size={{ base: 'full', md: 'lg' }}
      titleFontSize="14px"
      subtitleFontSize="xs"
    >
      <Dialog.Body>
        <NSAutocomplete
          handleChange={handleInputChange}
          inputValue={inputValue}
          control={control}
          isLoading={isLoading}
          isValid={isValid}
        />

        <VStack
          alignItems="start"
          justifyContent="center"
          bg="rgba(0, 127, 219, 0.15)"
          borderRadius="8px"
          p="12px 8px"
          border="1px solid #007FDB4D"
        >
          <Flex gap="6px">
            <Icon as={BlueWarningIcon} />
            <Heading color="info.500" fontWeight={600} fontSize="14px">
              Warning!
            </Heading>
          </Flex>
          <Text color="info.200" fontSize="xs" lineHeight="14.52px" ml={6}>
            Importing data will overwrite your connected social media accounts
            and update your nickname to match the imported account.
          </Text>
        </VStack>

        <HStack flexWrap="wrap" justifyContent="center" spacing={2} mt={4}>
          {Object.entries(ensMetadata).map(([key, metadata]) => (
            <ENSMetadataCard
              key={key}
              isLoading={isLoading}
              icon={metadata.icon}
              title={metadata.title}
              value={ensData?.[metadata.key]}
              metadataKey={metadata.key}
            />
          ))}
        </HStack>
      </Dialog.Body>

      <Dialog.Actions hideDivider gap={2} mt={6}>
        <Dialog.SecondaryAction
          isDisabled={handleSaveRequest.isPending}
          isLoading={handleSaveRequest.isPending}
          onClick={handleClose}
        >
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          isDisabled={handleSaveRequest.isPending || disableAction}
          isLoading={handleSaveRequest.isPending || isLoading}
          onClick={handleConfirmAction}
        >
          Import and overwrite
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
