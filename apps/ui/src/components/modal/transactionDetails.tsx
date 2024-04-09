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
      isOpen={isOpen}
      onClose={onClose}
    >
      <Dialog.Body>
        <VStack spacing={4}>
          <TextInput leftAddon leftAddonName="handle" value={domain} />
          <TextInput leftAddon leftAddonName="action" value="Registration" />
          <TextInput leftAddon leftAddonName="duration" value={'1'} />
          <TextInput leftAddon leftAddonName="cost" value={cost.toString()} />
        </VStack>
      </Dialog.Body>
    </Dialog.Modal>
  );
};
