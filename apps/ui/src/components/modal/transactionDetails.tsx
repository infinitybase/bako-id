import { VStack } from '@chakra-ui/react';
import { TextValue } from '..';
import { Dialog } from '../dialog';

interface ITransactionDetailsModal {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  cost: string;
  period: number;
  modalTitle: string;
}

export const TransactionDomainDetailsModal = ({
  isOpen,
  onClose,
  domain,
  cost,
  period,
  modalTitle,
}: ITransactionDetailsModal) => {
  console.log(period);
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
          <TextValue
            justifyContent="start"
            textColor="grey.100"
            leftAction={'handles'}
            content={domain}
          />
          <TextValue
            justifyContent="start"
            textColor="grey.100"
            leftAction={'action'}
            content="Registration"
          />
          <TextValue
            justifyContent="start"
            textColor="grey.100"
            leftAction={'duration'}
            content={`${period > 1 ? `${period} years` : `${period} year`}`}
          />
          <TextValue
            justifyContent="start"
            textColor="grey.100"
            leftAction={'cost'}
            content={`${cost.toString()} ETH`}
          />
        </VStack>
      </Dialog.Body>

      <Dialog.SecondaryAction onClick={onClose} mt={5}>
        Done
      </Dialog.SecondaryAction>
    </Dialog.Modal>
  );
};
