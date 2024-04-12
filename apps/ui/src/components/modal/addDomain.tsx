import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Button,
  Modal as ChakraModal,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import type { Domains } from '../../types';
import { validateDomain } from '../../utils/validator';
import { SearchInput } from '../inputs';

interface ModalProps {
  items: Domains[];
  setItems: (items: Domains[]) => void;
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  setDomain: (domain: string) => void;
}

export default function Modal({
  items,
  setItems,
  onClose,
  isOpen,
  domain,
  setDomain,
}: ModalProps) {
  const handleClick = () => {
    setItems([...items, { name: domain, period: 1 }]);
    onClose();
  };

  const error = validateDomain(domain, items);

  return (
    <ChakraModal size="sm" onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay
        bg="rgba(21, 22, 24, 0.7)"
        style={{ backdropFilter: 'blur(6px)' }}
      />
      ;
      <ModalContent
        borderRadius={10}
        sx={{ backgroundColor: 'background.500' }}
      >
        <ModalHeader alignItems={'center'} color="white">
          Add domain
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={8}>
          <VStack spacing={8}>
            <SearchInput
              errorMessage={error}
              onChange={(e) => setDomain(e.target.value)}
            />
            <Button
              onClick={handleClick}
              leftIcon={<Icon fontSize={18} as={PlusSquareIcon} />}
              backgroundColor={'brand.500'}
              color="background.500"
              w="full"
              display="flex"
              borderRadius={10}
              isDisabled={!!error || domain.length === 0}
            >
              Add domain
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}
