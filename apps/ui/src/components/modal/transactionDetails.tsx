import { VStack } from '@chakra-ui/react';
import { TextInput } from '..';
import { Dialog } from '../dialog';

interface ITransactionDetailsModal {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  cost: string;
  modalTitle: string;
}

export const TransactionDomainDetailsModal = ({
  isOpen,
  onClose,
  domain,
  cost,
  modalTitle,
}: ITransactionDetailsModal) => {
  return (
    <Dialog.Modal
      motionPreset="slideInBottom"
      modalTitle={modalTitle}
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Dialog.Body>
        <VStack spacing={2}>
          <TextInput
            textColor="grey.100"
            leftAddon
            leftAddonName="handles"
            value={domain}
          />
          <TextInput
            textColor="grey.100"
            leftAddon
            leftAddonName="action"
            value="Registration"
          />
          <TextInput
            textColor="grey.100"
            leftAddon
            leftAddonName="duration"
            value={'1 year'}
          />
          <TextInput
            textColor="grey.100"
            leftAddon
            leftAddonName="cost"
            value={`${cost.toString()} ETH`}
          />
        </VStack>
      </Dialog.Body>

      <Dialog.SecondaryAction onClick={onClose} mt={5}>
        Done
      </Dialog.SecondaryAction>
    </Dialog.Modal>
  );
};
