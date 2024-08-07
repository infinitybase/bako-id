import type { Metadata } from '@bako-id/sdk';
import { Dialog } from '../dialog';
import { EditTextValueInput } from '../inputs/editTextInput';

interface EditProfileFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setUpdates: React.Dispatch<React.SetStateAction<Metadata[]>>;
  type: string;
  title: string;
  validated: boolean | null;
}

export const EditProfileFieldsModal = ({
  isOpen,
  onClose,
  setUpdates,
  type,
  title,
  validated,
}: EditProfileFieldsModalProps) => {
  const handleSave = async (metadata: Metadata) => {
    setUpdates((prevUpdates) => [...prevUpdates, metadata]);
    onClose();
  };

  const selectedType =
    type.split(':')[1].charAt(0).toUpperCase() + type.split(':')[1].slice(1);

  return (
    <Dialog.Modal
      modalTitle={
        validated === null ? `Add ${selectedType}` : `Edit ${selectedType}`
      }
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
        <EditTextValueInput
          title={title}
          modalType={type}
          onMetadataChange={handleSave}
          onClose={onClose}
        />
      </Dialog.Body>
      {/* <Dialog.Actions hideDivider>
        <Dialog.SecondaryAction onClick={onClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction onClick={onClose}>Save</Dialog.PrimaryAction>
      </Dialog.Actions> */}
    </Dialog.Modal>
  );
};
