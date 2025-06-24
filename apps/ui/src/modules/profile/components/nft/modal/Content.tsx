import {
  ModalContent,
  ModalOverlay,
  type ModalContentProps,
} from '@chakra-ui/react';

interface NftModalContentProps extends ModalContentProps {
  children: React.ReactNode;
}

export const Content = ({ children, ...rest }: NftModalContentProps) => {
  return (
    <>
      <ModalOverlay />
      <ModalContent display="flex" position="relative" gap={4} p={6} {...rest}>
        {children}
      </ModalContent>
    </>
  );
};
