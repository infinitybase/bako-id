import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { Dialog } from '../dialog';

import { FileUploadIcon } from '../icons/fileUploadIcon';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';
import { useCustomToast } from '../toast';
import { useParams } from '@tanstack/react-router';
import { useUpdateFile } from '../../hooks/useUploadFile';

import { ProgressButton } from '../buttons/progressButton';
import { TrashIcon } from '../icons/trashIcon';

interface EditProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfilePicBox = ({
  setUploadedFile,
  isSigning,
}: {
  setUploadedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  isSigning: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    handleVerifyFile(files[0]);
  };

  const handleDeleteUploadedFile = () => {
    setUploadedFile(undefined);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

    setUploadedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
  };

  const handleBrowseFileClick = () => {
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
      pointerEvents={isSigning ? 'none' : 'unset'}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: isSigning ? 0.5 : 'none',
        borderRadius: '0.75rem',
      }}
    >
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/png"
        display="none"
      />

      {previewUrl ? (
        <Button
          position="absolute"
          bg="error.500"
          _hover={{
            bg: 'error.600',
          }}
          p={1}
          size="sm"
          bottom={4}
          right={4}
          onClick={handleDeleteUploadedFile}
        >
          <TrashIcon w={5} h={5} color="input.600" />
        </Button>
      ) : (
        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          gap={4}
          pointerEvents={isDragging ? 'none' : 'unset'}
        >
          <FileUploadIcon h={14} w={14} />

          <Box textAlign="center">
            <Text color="section.200">
              Choose a file or drag & drop it here
            </Text>
            <Text color="section.500">JPEG and PNG formats, up to 3MB</Text>
          </Box>
          <Button bgColor="grey.100" onClick={handleBrowseFileClick}>
            Browse file
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export const EditProfilePicModal = ({
  isOpen,
  onClose,
}: EditProfilePicModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const { domain } = useParams({ strict: false });
  const {
    isSigning,
    signProgress,
    handleSignAvatarTransaction,
    handleClose,
    setUploadedFile,
    uploadedFile,
  } = useUpdateFile(domain ?? '', onClose);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.substring(0));
    console.log('Event', e);
  };

  return (
    <Dialog.Modal
      modalTitle="Upload avatar"
      modalSubtitle="You can import an file from your device or import NFT."
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      hideCloseButton={isSigning}
      gapBetweenBodyAndHeader="6"
      closeOnOverlayClick={false}
      closeOnEsc={!isSigning}
    >
      <Dialog.Body
        bgColor="input.900"
        color="white"
        rounded="xl"
        w="full"
        h={80}
      >
        <EditProfilePicBox
          setUploadedFile={setUploadedFile}
          isSigning={isSigning}
        />
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
        <Dialog.SecondaryAction onClick={handleClose} isDisabled={isSigning}>
          Cancel
        </Dialog.SecondaryAction>

        <ProgressButton
          progress={signProgress}
          w="full"
          isDisabled={isSigning || !uploadedFile}
          onClick={handleSignAvatarTransaction}
          color="background.500"
          bg="button.500"
          fontSize={14}
          _hover={{ bgColor: 'button.600' }}
          progressColor="white"
        >
          <Flex align="center" gap={2}>
            {isSigning ? <Text>Signing...</Text> : <Text>Upload</Text>}
          </Flex>
        </ProgressButton>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
