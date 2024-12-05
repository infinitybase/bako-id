import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  type ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { SmallCloseIcon } from '../icons/smallCloseIcon';

export interface DialogModalProps extends ModalProps {
  onClose: () => void;
  hideCloseButton?: boolean;
  hideHeader?: boolean;
  modalTitle?: string | ReactNode;
  modalSubtitle?: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
}

const DialogModal = (props: DialogModalProps) => {
  const { children, modalTitle, modalSubtitle, onClose, hideHeader, ...rest } =
    props;

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
            {!hideHeader && (
              <ModalHeader
                w="full"
                minW={hideCloseButton ? '100%' : '70%'}
                fontSize={props.titleFontSize ?? 'lg'}
              >
                {modalTitle}
              </ModalHeader>
            )}

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
            <Text
              fontSize={props.subtitleFontSize ?? 'sm'}
              color="grey.subtitle"
            >
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
