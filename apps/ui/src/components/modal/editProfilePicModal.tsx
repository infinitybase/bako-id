import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { Dialog } from '../dialog';

import { FileUploadIcon } from '../icons/fileUploadIcon';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { useCustomToast } from '../toast';

interface EditProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfilePicBox = () => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { errorToast } = useCustomToast();

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    console.log('_files', files);

    if (files && files.length > 0) {
      handleVerifyFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVerifyFile(file);
    }
  };

  const handleVerifyFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      errorToast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG or PNG image',
      });

      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      errorToast({
        title: 'File too large',
        description: 'Please upload an image smaller than 3MB',
      });
      return;
    }
  };

  const handleButtonClick = () => {
    fileInputRef?.current?.click();
  };
  return (
    <Box
      w="full"
      h="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      rounded="xl"
      border="2px dashed"
      borderColor={isDragging ? 'grey.100' : 'grey.400'}
      p={4}
      bg={isDragging ? 'grey.600' : 'transparent'}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      transition="all 0.2s ease"
    >
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/png"
        display="none"
      />
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
        pointerEvents={isDragging ? 'none' : 'unset'}
      >
        <FileUploadIcon h={14} w={14} />

        <Box textAlign="center">
          <Text color="section.200">Choose a file or drag & drop it here</Text>
          <Text color="section.500">JPEG and PNG formats, up to 3MB</Text>
        </Box>
        <Button bgColor="grey.100" onClick={handleButtonClick}>
          Browse file
        </Button>
      </Flex>
    </Box>
  );
};

export const EditProfilePicModal = ({
  isOpen,
  onClose,
}: EditProfilePicModalProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.substring(0));
    console.log('Event', e);
  };

  return (
    <Dialog.Modal
      modalTitle="Upload avatar"
      modalSubtitle="You can import an file from your device or import NFT."
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      gapBetweenBodyAndHeader="6"
    >
      <Dialog.Body
        bgColor="input.900"
        color="white"
        rounded="xl"
        w="full"
        h={80}
      >
        <EditProfilePicBox />
        <Input
          placeholder="Import NFT Address"
          mt={6}
          value={inputValue}
          color="white"
          h={12}
          textColor="text.700"
          background="input.600"
          type="text"
          errorBorderColor="error.500"
          onChange={handleChange}
          border="1px solid"
          borderColor="grey.500"
          borderRadius={10}
          sx={{ _placeholder: { color: 'grey.200' } }}
          _focus={{}}
          _hover={{}}
          _focusVisible={{}}
        />
      </Dialog.Body>
      <Dialog.Actions hideDivider mt={24}>
        <Dialog.SecondaryAction onClick={onClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction onClick={onClose}>Upload</Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
