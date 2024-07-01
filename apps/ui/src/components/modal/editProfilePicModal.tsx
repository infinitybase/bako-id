import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { Dialog } from '../dialog';
import { CloudIcon } from '../icons/cloudIcon';

interface EditProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfilePicBox = () => {
  return (
    <Box
      w="full"
      h="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      rounded="xl"
      border="2px dashed"
      borderColor="grey.400"
      p={4}
      mt={4}
    >
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
      >
        <Icon as={CloudIcon} w={16} h={16} color="section.200" />
        <Box>
          <Text color="section.200">Choose a file or drag & drop it here</Text>
          <Text color="section.500">JPEG and PNG formats, up to 3MB</Text>
        </Box>
        <Button bgColor="grey.100">Browse file</Button>
      </Flex>
    </Box>
  );
};

export const EditProfilePicModal = ({
  isOpen,
  onClose,
}: EditProfilePicModalProps) => {
  return (
    <Dialog.Modal
      modalTitle="Upload avatar"
      modalSubtitle="You can import an file from your device or import NFT."
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <Dialog.Body
        bgColor="input.900"
        color="white"
        rounded="xl"
        w="full"
        h={80}
      >
        <EditProfilePicBox />
      </Dialog.Body>
      <Dialog.Actions hideDivider mt={16}>
        <Dialog.SecondaryAction onClick={onClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction onClick={onClose}>Upload</Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
