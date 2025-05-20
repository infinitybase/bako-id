import { Dialog } from '../dialog';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  isConfirming?: boolean;
}

export const ConfirmationDialog = ({
  children,
  isOpen,
  onClose,
  onConfirm,
  title,
  isConfirming,
}: ConfirmationDialogProps) => {
  return (
    <Dialog.Modal isOpen={isOpen} onClose={onClose} modalTitle={title}>
      <Dialog.Body>{children}</Dialog.Body>
      <Dialog.Actions>
        <Dialog.SecondaryAction onClick={onClose} isDisabled={isConfirming}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction isLoading={isConfirming} onClick={onConfirm}>
          Confirm
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
