import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  type ModalProps,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { SmallCloseIcon } from '../icons/smallCloseIcon';

export interface DialogModalProps extends ModalProps {
  onClose: () => void;
  hideCloseButton?: boolean;
  modalTitle?: string | ReactNode;
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
            <ModalHeader
              w="full"
              minW={hideCloseButton ? '100%' : '70%'}
              fontSize="lg"
            >
              {modalTitle}
            </ModalHeader>

            {!hideCloseButton && (
              <Box
                w={6}
                h={6}
                _hover={{
                  cursor: 'pointer',
                  color: 'button.500',
                }}
                as={SmallCloseIcon}
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
