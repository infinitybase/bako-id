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
