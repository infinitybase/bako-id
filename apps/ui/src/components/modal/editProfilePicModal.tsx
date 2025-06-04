import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { Dialog } from '../dialog';

import { useParams } from '@tanstack/react-router';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';
import { useUpdateFile } from '../../hooks/useUploadFile';
import { FileUploadIcon } from '../icons/fileUploadIcon';
import { useCustomToast } from '../toast';

import { useProvider, useWallet } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { isB256 } from 'fuels';
import { FuelAssetService } from '../../services/fuel-assets';
import { B256HashLength } from '../../utils/b256HashLength';
import { parseURI } from '../../utils/formatter';
import { ProgressButton } from '../buttons/progressButton';
import { TrashIcon } from '../icons/trashIcon';

interface EditProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfilePicBox = ({
  setUploadedFile,
  isSigning,
  nftImagePreview,
  setInputValue,
}: {
  setUploadedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  isSigning: boolean;
  nftImagePreview: string | null | undefined;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
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
    setInputValue('');

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
      mx="auto"
      w="400px"
      h="400px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      rounded="xl"
      border="2px dashed"
      borderColor={isDragging ? 'grey.100' : 'grey.400'}
      p={4}
      bg={isDragging ? 'grey.600' : 'transparent'}
      onDragEnter={!nftImagePreview ? handleDragEnter : undefined}
      onDragLeave={!nftImagePreview ? handleDragLeave : undefined}
      onDragOver={!nftImagePreview ? handleDragOver : undefined}
      onDrop={!nftImagePreview ? handleDrop : undefined}
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
        backgroundImage: previewUrl
          ? `url(${previewUrl})`
          : nftImagePreview
            ? `url(${nftImagePreview})`
            : 'none',
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

      {nftImagePreview || previewUrl ? (
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

          <Box textAlign="center" fontSize="xs">
            <Text color="section.200">
              Choose a file or drag & drop it here
            </Text>
            <Text color="section.500">JPEG and PNG formats, up to 3MB</Text>
          </Box>
          <Button
            bgColor="grey.100"
            w="101px"
            onClick={handleBrowseFileClick}
            fontSize="sm"
          >
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
  const { errorToast } = useCustomToast();

  const { domain } = useParams({ strict: false });
  const { provider } = useProvider();
  const {
    isSigning,
    signProgress,
    handleUploadFile,
    handleClose,
    setUploadedFile,
    uploadedFile,
    setMetadataAvatar,
    setInputValue,
    inputValue,
  } = useUpdateFile(domain ?? '', onClose);

  const { wallet } = useWallet();

  const isValidAssetId =
    inputValue.length === B256HashLength && isB256(inputValue);
  const enableNFTRequest = !!wallet && isValidAssetId;

  const { data: nftImage, isLoading: isNftImageLoading } = useQuery({
    queryKey: ['nft-image', inputValue],
    queryFn: async () => {
      const chainId = await provider?.getChainId();
      try {
        const nft = await FuelAssetService.byAssetId({
          assetId: inputValue,
          chainId: chainId!,
        });

        let metadata: Record<string, string> = nft?.metadata ?? {};
        const metadataEntries = Object.entries(metadata).filter(
          ([key]) => !key.toLowerCase().includes('uri')
        );
        if (metadataEntries.length === 0 && nft?.uri?.endsWith('.json')) {
          const metadataFormUri: Record<string, string> = await fetch(
            parseURI(nft?.uri)
          )
            .then((res) => res.json())
            .catch(() => ({}));

          metadata = metadataFormUri;
        }

        const image = Object.entries(metadata).find(([key]) =>
          key.includes('image')
        )?.[1];

        return image ? parseURI(image) : null;
      } catch (error) {
        console.error(error);
        errorToast({
          title: 'Invalid NFT address',
          description: 'Please try again',
        });
        return null;
      }
    },

    enabled: enableNFTRequest,
  });

  const handleAvatarUpload = () => {
    if (isValidAssetId && nftImage) {
      setMetadataAvatar(nftImage);
      return;
    }
    handleUploadFile();
  };

  const isUploadDisabled = isSigning || (nftImage ? false : !uploadedFile);

  return (
    <Dialog.Modal
      modalTitle="Upload avatar"
      modalSubtitle="Recommended image size is 500x500 pixels, 3Mb maximum"
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      hideCloseButton={isSigning}
      gapBetweenBodyAndHeader="6"
      closeOnOverlayClick={false}
      closeOnEsc={!isSigning}
      subtitleFontSize="xs"
      titleFontSize="sm"
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
          nftImagePreview={nftImage ?? undefined}
          setInputValue={setInputValue}
        />
        <Text color="grey.subtitle" mt={6} fontSize="xs">
          Or insert NFT Asset ID:
        </Text>
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
          _placeholder={{ color: 'grey.200', fontSize: 'sm' }}
          onChange={(e) => {
            const alphanumericValue = e.target.value.replace(
              /[^a-zA-Z0-9]/g,
              ''
            );
            setInputValue(alphanumericValue.trim());
          }}
          maxLength={B256HashLength}
          border="1px solid"
          borderColor="grey.500"
          borderRadius={10}
          isDisabled={isSigning || isNftImageLoading || !!uploadedFile}
          _focus={{}}
          _hover={{}}
          _focusVisible={{}}
        />

        {!isNftImageLoading && isValidAssetId && !nftImage && (
          <Text fontSize="xs" color="error.500" my={1}>
            Invalid Asset ID. Ensure it is a Fuel-compatible NFT.
          </Text>
        )}
      </Dialog.Body>
      <Dialog.Actions hideDivider mt={56}>
        <Dialog.SecondaryAction onClick={handleClose} isDisabled={isSigning}>
          Cancel
        </Dialog.SecondaryAction>

        <ProgressButton
          progress={signProgress}
          w="full"
          isDisabled={isUploadDisabled}
          onClick={handleAvatarUpload}
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
