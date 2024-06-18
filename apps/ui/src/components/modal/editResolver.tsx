import {
  Divider,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Dialog } from '../dialog';
import { TextValue } from '../inputs';

interface IEditResolverModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resolver: string) => void;
  domain: string;
  resolver: string;
}

interface IDetailStepModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  domain: string;
  resolver: string;
  newResolver: string;
}

interface IEditResolverStepModal {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  setNewResolver: (value: string) => void;
}

const DetailStepModal = ({
  isOpen,
  onClose,
  domain,
  resolver,
  newResolver,
  onConfirm,
}: IDetailStepModal) => (
  <Dialog.Modal
    motionPreset="slideInBottom"
    modalTitle="Transaction details"
    modalSubtitle="All changes in your Handle generates a new transaction. Confirm the details before you continue."
    isOpen={isOpen}
    onClose={onClose}
  >
    <Dialog.Body alignItems="flex-start">
      <VStack spacing={2}>
        <TextValue leftAction={'action'} content="Edit Resolver" />
        <TextValue leftAction={'handle'} content={domain} />
      </VStack>
      <Text fontSize="sm" mt={6} mb={2}>
        Updates
      </Text>
      <Divider mb={4} />
      <VStack spacing={2}>
        <TextValue leftAction={'old'} content={resolver} />
        <TextValue leftAction={'new'} content={newResolver} />
      </VStack>
    </Dialog.Body>

    <Dialog.Actions hideDivider mt={8} gap={2}>
      <Dialog.SecondaryAction onClick={onClose}>Cancel</Dialog.SecondaryAction>
      <Dialog.PrimaryAction onClick={onConfirm}>Confirm</Dialog.PrimaryAction>
    </Dialog.Actions>
  </Dialog.Modal>
);

const EditResolverStepModal = ({
  isOpen,
  onClose,
  onOpen,
  setNewResolver,
}: IEditResolverStepModal) => (
  <Dialog.Modal
    size="lg"
    motionPreset="slideInBottom"
    modalTitle="Resolver"
    isOpen={isOpen}
    onClose={onClose}
  >
    <Dialog.Body>
      <VStack alignItems="flex-start" justifyItems="center" spacing={2}>
        <FormControl>
          <FormLabel pb={4}>Address</FormLabel>
          <Textarea
            onChange={(e) => setNewResolver(e.target.value)}
            rounded="lg"
            fontWeight="medium"
            size="lg"
            bgColor="input.600"
            pt={4}
            rows={4}
            border="1px solid"
            borderColor="text.500"
          />
        </FormControl>
      </VStack>
    </Dialog.Body>

    <Dialog.Actions hideDivider mt={8} gap={2}>
      <Dialog.SecondaryAction onClick={onClose}>Cancel</Dialog.SecondaryAction>
      <Dialog.PrimaryAction onClick={onOpen}>Save</Dialog.PrimaryAction>
    </Dialog.Actions>
  </Dialog.Modal>
);

export const EditResolverModal = ({
  isOpen,
  onClose,
  onConfirm,
  domain,
  resolver,
}: IEditResolverModal) => {
  const {
    isOpen: isOpenDetailStep,
    onClose: onCloseDetailStep,
    onOpen: onOpenDetailStep,
  } = useDisclosure();
  const [newResolver, setNewResolver] = useState<string>('');

  return isOpenDetailStep ? (
    <DetailStepModal
      isOpen={isOpenDetailStep}
      onClose={onCloseDetailStep}
      onConfirm={() => {
        onConfirm(newResolver);
        onCloseDetailStep();
      }}
      domain={domain}
      resolver={resolver}
      newResolver={newResolver}
    />
  ) : (
    <EditResolverStepModal
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpenDetailStep}
      setNewResolver={setNewResolver}
    />
  );
};
