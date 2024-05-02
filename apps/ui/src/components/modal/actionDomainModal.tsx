import { VStack } from '@chakra-ui/react';
import { TextValue } from '..';
import { Dialog } from '../dialog';

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
          <TextValue leftAction={'action'} content={action} />
          <TextValue leftAction={'handle'} content={domain} />
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
