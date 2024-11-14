import { Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { Dialog } from '../dialog';
import { NSAutocomplete } from './nsAutocomplete';
import { useForm } from 'react-hook-form';
import { BlueWarningIcon } from '../icons';

export type NSAutocompleteValue = {
  ens: string;
};

export const NSDialog = () => {
  const {
    control,
    formState: { errors },
  } = useForm<NSAutocompleteValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      ens: '',
    },
  });

  return (
    <Dialog.Modal
      motionPreset="slideInBottom"
      modalTitle="Import account from ENS"
      modalSubtitle="Set your ENS username below and confirm the import."
      isOpen={true}
      onClose={() => console.log('fhecou')}
      closeOnOverlayClick={false}
      size={{ base: 'full', md: 'lg' }}
      titleFontSize="14px"
      subtitleFontSize="xs"
    >
      <Dialog.Body>
        <VStack>
          <NSAutocomplete
            handleChange={() => {}}
            inputValue={'resolverAddress'}
            isValid={true}
            errors={errors}
            control={control}
            isLoading={false}
            isSignLoading={false}
          />
        </VStack>

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
      </Dialog.Body>

      <Dialog.Actions hideDivider gap={2} mt={6}>
        <Dialog.SecondaryAction>Cancel</Dialog.SecondaryAction>
        <Dialog.PrimaryAction>Import and overwrite</Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
