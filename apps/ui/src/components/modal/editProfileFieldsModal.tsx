import { Dialog } from '../dialog';
import { EditTextValueInput } from '../inputs/editTextInput';

interface EditProfileFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  title: string;
  validated: boolean | null;
}

export const EditProfileFieldsModal = ({
  isOpen,
  onClose,
  type,
  title,
  validated,
}: EditProfileFieldsModalProps) => {
  return (
    <Dialog.Modal
      modalTitle={validated === null ? `Add ${title}` : `Edit ${title}`}
      modalSubtitle="You can edit your profile fields here."
      isOpen={isOpen}
      autoFocus={false}
      onClose={onClose}
      size="xl"
    >
      <Dialog.Body
        bgColor="input.900"
        color="white"
        rounded="xl"
        w="full"
        h={32}
      >
        <EditTextValueInput modalType={type} onSubmit={() => {}} />
      </Dialog.Body>
      <Dialog.Actions hideDivider>
        <Dialog.SecondaryAction onClick={onClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction onClick={onClose}>Save</Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
