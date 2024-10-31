import { Dialog } from '../dialog';
import { EditTextValueInput } from '../inputs/editTextInput';

interface EditProfileFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  updates: { key: string; value: string }[];
  setUpdates: React.Dispatch<
    React.SetStateAction<{ key: string; value: string }[]>
  >;
  type: string;
  title: string;
  validated: boolean | null;
}

export const EditProfileFieldsModal = ({
  isOpen,
  onClose,
  setUpdates,
  updates,
  type,
  title,
  validated,
}: EditProfileFieldsModalProps) => {
  const handleSave = async (metadata: { key: string; value: string }) => {
    setUpdates((prevUpdates) => {
      const index = prevUpdates.findIndex((m) => m.key === metadata.key);
      if (index !== -1) {
        // If the metadata already exists, update it
        const newUpdates = [...prevUpdates];
        newUpdates[index] = metadata;
        return newUpdates;
      }

      return [...prevUpdates, metadata];
    });
    onClose();
  };

  const currentValue = updates.find((m) => m.key === type)?.value;

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
          title={currentValue ?? title}
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
