import type { ButtonProps } from '@chakra-ui/react';
import { Dialog } from '../dialog';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  isConfirming?: boolean;
  confirmActionVariant?: ButtonProps['variant'];
  confirmActionLabel?: string;
  cancelActionLabel?: string;
  cancelActionVariant?: ButtonProps['variant'];
}

export const ConfirmationDialog = ({
  children,
  isOpen,
  onClose,
  onConfirm,
  title,
  isConfirming,
  confirmActionVariant = 'primary',
  confirmActionLabel = 'Confirm',
  cancelActionLabel = 'Cancel',
  cancelActionVariant = 'secondary',
}: ConfirmationDialogProps) => {
  return (
    <Dialog.Modal
      size="md"
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={title}
      gapBetweenBodyAndHeader="1"
    >
      <Dialog.Body>{children}</Dialog.Body>
      <Dialog.Actions hideDivider mt={6}>
        <Dialog.SecondaryAction
          variant={cancelActionVariant}
          onClick={onClose}
          isDisabled={isConfirming}
        >
          {cancelActionLabel}
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          isLoading={isConfirming}
          onClick={onConfirm}
          variant={confirmActionVariant}
        >
          {confirmActionLabel}
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
