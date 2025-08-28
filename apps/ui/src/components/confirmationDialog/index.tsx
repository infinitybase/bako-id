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
  isGarage?: boolean;
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
  isGarage,
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
          {...(isGarage && {
            _hover: {
              borderColor: 'garage.100',
              color: 'garage.100',
            },
          })}
        >
          {cancelActionLabel}
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          isLoading={isConfirming}
          onClick={onConfirm}
          variant={isGarage ? 'mktPrimary' : confirmActionVariant}
          {...(isGarage && {
            _disabled: {
              opacity: 0.7,
              cursor: 'not-allowed',
            },
          })}
        >
          {confirmActionLabel}
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
