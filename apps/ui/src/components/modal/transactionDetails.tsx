import { Box, Divider, Text, VStack } from '@chakra-ui/react';
import { TextValue } from '..';
import { Dialog } from '../dialog';

interface ITransactionDomainDetailsModal {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  cost: string;
  period: number;
  modalTitle: string;
}

interface ITranscationDetailsModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  domain: string;
  updates: { key: string; value: string }[];
  updateInProgress: boolean;
}

export const TransactionDomainDetailsModal = ({
  isOpen,
  onClose,
  domain,
  cost,
  period,
  modalTitle,
}: ITransactionDomainDetailsModal) => {
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
            leftAction={'total'}
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

export const TransactionsDetailsModal = ({
  domain,
  isOpen,
  onClose,
  onConfirm,
  updates,
  updateInProgress,
}: ITranscationDetailsModal) => {
  return (
    <Dialog.Modal
      motionPreset="slideInBottom"
      modalTitle="Transaction Details"
      modalSubtitle="All changes in your Handle generates a new transaction. Confirm the details before you continue."
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
          <Box w="full" display="flex" flexDirection="column" my={4}>
            <Text
              alignSelf="start"
              as="span"
              fontWeight="normal"
              color="grey.100"
              fontSize="sm"
            >
              Updates
            </Text>
            <Divider borderColor="grey.500" mt={2} />
          </Box>
        </VStack>
        <VStack mb={5}>
          {updates.map((update) => {
            const formatedUpdates =
              update.key.split(':')[1].charAt(0) +
              update.key.split(':')[1].slice(1);

            return (
              <TextValue
                key={update.key}
                textColor="grey.100"
                leftAction={formatedUpdates}
                content={update.value}
              />
            );
          })}
        </VStack>
      </Dialog.Body>
      <Dialog.Actions hideDivider>
        <Dialog.SecondaryAction onClick={onClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          onClick={onConfirm}
          disabled={updateInProgress}
          isLoading={updateInProgress}
        >
          Confirm
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
