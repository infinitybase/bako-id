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
        <VStack spacing={2}>
          <TextInput
            leftAddon
            leftAddonName="action"
            textAlign="right"
            value={action}
          />
          <TextInput
            leftAddon
            leftAddonName="handle"
            textAlign="right"
            value={domain}
          />
        </VStack>
      </Dialog.Body>

      {hasActions && (
        <Dialog.Actions hideDivider mt={8} gap={2}>
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
