import { CloseIcon } from '@chakra-ui/icons';
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react';

export interface DialogModalProps extends ModalProps {
  onClose: () => void;
  hideCloseButton?: boolean;
  modalTitle?: string;
  modalSubtitle?: string;
}

const DialogModal = (props: DialogModalProps) => {
  const { children, modalTitle, modalSubtitle, onClose, ...rest } = props;

  const hideCloseButton = props?.hideCloseButton ?? false;

  return (
    <Modal
      variant="glassmorphic"
      size="2xl"
      blockScrollOnMount={false}
      isCentered
      onClose={onClose}
      {...rest}
    >
      <ModalOverlay />
      <ModalContent rounded="xl" p={6}>
        <VStack spacing={2} w="full" align="flex-start" mb={8}>
          <Flex w="full" align="center" justifyContent="space-between">
            <ModalHeader minW="50%" fontSize="lg">
              {modalTitle}
            </ModalHeader>

            {!hideCloseButton && (
              <CloseIcon
                _hover={{
                  cursor: 'pointer',
                  color: 'button.500',
                }}
                onClick={onClose}
              />
            )}
          </Flex>
          {modalSubtitle && (
            <Text fontSize="sm" color="grey.subtitle">
              {modalSubtitle}
            </Text>
          )}
        </VStack>

        <ModalBody
          w="full"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { DialogModal };
