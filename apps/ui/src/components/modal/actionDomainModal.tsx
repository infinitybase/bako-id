import { VStack } from '@chakra-ui/react';
import { Dialog } from '../dialog';
import { TextInput } from '../inputs';

interface ITransactionDetailsModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  domain: string;
  action: string;
  modalTitle: string;
  modalSubtitle?: string;
  hasActions?: boolean;
}

export const ActionDomainModal = ({
  isOpen,
  onClose,
  onConfirm,
  hasActions,
  domain,
  modalTitle,
  modalSubtitle,
  action,
}: ITransactionDetailsModal) => {
  return (
    <Dialog.Modal
      motionPreset="slideInBottom"
      modalTitle={modalTitle}
      modalSubtitle={modalSubtitle}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Dialog.Body>
        <VStack spacing={4}>
          <TextInput leftAddon leftAddonName="action" value={action} />
          <TextInput leftAddon leftAddonName="handle" value={domain} />
        </VStack>
      </Dialog.Body>

      {hasActions && (
        <Dialog.Actions gap={2}>
          <Dialog.SecondaryAction onClick={onClose}>
            Cancel
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction onClick={onConfirm}>
            Confirm
          </Dialog.PrimaryAction>
        </Dialog.Actions>
      )}
    </Dialog.Modal>
  );
};
