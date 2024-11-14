import {
  Flex,
  Heading,
  Icon,
  type ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Dialog } from '../../../components/dialog';
import { NSAutocomplete } from './autocomplete';
import { BlueWarningIcon } from '../../../components/icons';
import { type MetadataKeyValue, useMetadata } from '../../../hooks/useMetadata';
import type { MetadataKeys } from '../../../utils/metadataKeys';
import { useENSForm } from '../hooks/useENSForm';

export type NSAutocompleteValue = {
  ens: string;
};

const value = {
  'contact:website': 'https://mockedwebsite.ko',
  'social:x': 'mockedX',
  'social:github': 'mockedGithub',
};

export interface NSDialogProps extends Omit<ModalProps, 'children'> {}

export const NSDialog = ({ isOpen, onClose, ...rest }: NSDialogProps) => {
  const { handleSaveRequest, setUpdatedMetadata } = useMetadata();
  const { ensData, inputValue, control, errors, handleInputChange, isLoading } =
    useENSForm();

  console.log('isLoading:', isLoading);

  console.log('ensData:', ensData);

  const metadataArray: MetadataKeyValue[] = Object.entries(value).map(
    ([key, value]) => ({
      key: key as MetadataKeys,
      value,
    }),
  );

  const handleConfirmAction = () => {
    setUpdatedMetadata(metadataArray);

    handleSaveRequest.mutate();
  };

  return (
    <Dialog.Modal
      {...rest}
      motionPreset="slideInBottom"
      modalTitle="Import account from ENS"
      modalSubtitle="Set your ENS username below and confirm the import."
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={{ base: 'full', md: 'lg' }}
      titleFontSize="14px"
      subtitleFontSize="xs"
    >
      <Dialog.Body>
        <VStack>
          <NSAutocomplete
            handleChange={handleInputChange}
            inputValue={inputValue}
            isValid={true}
            errors={errors}
            control={control}
            isLoading={isLoading}
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
        <Dialog.SecondaryAction
          isDisabled={handleSaveRequest.isPending}
          isLoading={handleSaveRequest.isPending}
          onClick={onClose}
        >
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          isDisabled={handleSaveRequest.isPending}
          isLoading={handleSaveRequest.isPending}
          onClick={handleConfirmAction}
        >
          Import and overwrite
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
