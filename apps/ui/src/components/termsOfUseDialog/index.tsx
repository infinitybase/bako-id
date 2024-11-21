import { Box, Divider, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { Dialog } from '../dialog';
import { termsOfUse, privacyPolicy } from './utils/data';
import { useTermsDialog } from './useTermsDialog';
import { useRef, useState } from 'react';

interface TermsOfUseDialogProps {
  showTerms: boolean;
  setShowTerms: (value: boolean) => void;
  setAgreed?: (value: boolean) => void;
  agreed?: boolean;
  handleConfirmAction?: () => Promise<void>;
}

const TermsOfUseDialog = ({
  agreed,
  setShowTerms,
  showTerms,
  setAgreed,
  handleConfirmAction,
}: TermsOfUseDialogProps) => {
  const { onClose } = useDisclosure();
  const [read, setRead] = useState(false);
  const scrollContainerRef = useRef(null);
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      if (Math.ceil(scrollTop) + clientHeight >= scrollHeight) {
        setRead(true);
      }
    }
  };
  const handleClose = () => {
    setRead(false);
    setShowTerms(false);
    onClose();
  };

  const handleConfirm = () => {
    setAgreed?.(true);
    setShowTerms(false);
    handleConfirmAction?.();
  };

  const { hideCloseButton, textHeight } = useTermsDialog();

  return (
    <Dialog.Modal
      hideCloseButton={hideCloseButton}
      motionPreset="slideInBottom"
      modalTitle="Bako ID Terms Of Use Agreement"
      modalSubtitle="You must accept the Terms of Use before you buy your domain."
      isOpen={agreed ? false : showTerms}
      onClose={handleClose}
      closeOnOverlayClick={false}
      size={{ base: 'full', md: 'lg' }}
    >
      <Divider borderColor={'grey.500'} mb={8} />
      <Dialog.Body>
        <VStack
          ref={scrollContainerRef}
          onScroll={handleScroll}
          h={textHeight()}
          spacing={0}
          overflowY="scroll"
          pr={4}
          sx={{
            '&::-webkit-scrollbar': {
              width: '6px',
              maxHeight: '330px',
              backgroundColor: 'grey.900',
              borderRadius: '30px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'button.500',
              borderRadius: '30px',
              height: '10px',
            },
          }}
        >
          <VStack w="full" alignItems="flex-start">
            {termsOfUse.map(({ title, paragraphs }, index) => (
              <Box key={title}>
                <Text
                  fontSize={'sm'}
                  color={'grey.75'}
                  fontWeight={'bold'}
                  mb={4}
                  mt={!index ? 0 : 4}
                >
                  {title}
                </Text>
                <VStack alignItems={'flex-start'}>
                  {paragraphs.map((paragraph) => (
                    <Text
                      key={paragraph}
                      fontSize={'sm'}
                      color={'grey.75'}
                      fontWeight={400}
                    >
                      {paragraph}
                    </Text>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
          <Divider my={10} borderColor={'grey.500'} />

          <Text fontSize={'lg'} fontWeight={'bold'}>
            Bako ID Privacy Policy
          </Text>

          <VStack w="full" alignItems="flex-start">
            {privacyPolicy.map(({ title, paragraphs }) => (
              <Box key={title}>
                <Text
                  fontSize={'sm'}
                  color={'grey.75'}
                  fontWeight={'bold'}
                  my={4}
                >
                  {title}
                </Text>
                <VStack alignItems={'flex-start'}>
                  {paragraphs.map((paragraph) => (
                    <Text
                      key={paragraph}
                      fontSize={'sm'}
                      color={'grey.75'}
                      fontWeight={400}
                    >
                      {paragraph}
                    </Text>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Dialog.Body>

      {handleConfirmAction && (
        <Dialog.Actions hideDivider gap={2} mt={4}>
          <Dialog.SecondaryAction onClick={handleClose}>
            Decline
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction onClick={handleConfirm} isDisabled={!read}>
            Accept
          </Dialog.PrimaryAction>
        </Dialog.Actions>
      )}
    </Dialog.Modal>
  );
};

export { TermsOfUseDialog };
