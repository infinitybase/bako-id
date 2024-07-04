import { UserMetadataContract, type Metadata } from '@bako-id/sdk';
import { useWallet } from '@fuels/react';
import { useParams } from '@tanstack/react-router';
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
  const { domain } = useParams({ strict: false });
  const { wallet } = useWallet();
  if (!wallet) return;
  const userMetadata = UserMetadataContract.initialize(wallet, domain);

  const handleSave = async (metadata: Metadata) => {
    await userMetadata.saveMetadata(metadata);
  };

  const selectedType = type.charAt(0).toUpperCase() + type.slice(1);

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
          onSave={handleSave}
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
