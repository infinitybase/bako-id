import { UserMetadataContract, type Metadata } from '@bako-id/sdk';
import {
  Button,
  CloseButton,
  Flex,
  Icon,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { useParams } from '@tanstack/react-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Metadatas } from '../../utils/metadatas';
import { MetadataCard } from '../card/metadataCard';
import { Dialog } from '../dialog';
import { AvatarIcon } from '../icons';
import { FlagIcon } from '../icons/flagIcon';
import { EditProfileFieldsModal } from './editProfileFieldsModal';
import { EditProfilePicModal } from './editProfilePicModal';
import { TransactionsDetailsModal } from './transactionDetails';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TabsTypes = [
  { key: 'General', name: 'General' },
  { key: 'Social', name: 'Social' },
  { key: 'Address', name: 'Address' },
  { key: 'Website', name: 'Website' },
  // { key: 'Other', name: 'Other' },
];

const ModalTitle = ({ onClose }: Pick<EditProfileModalProps, 'onClose'>) => {
  const modalTitle = useDisclosure();
  const { domain } = useParams({ strict: false });

  return (
    <Flex w="full" justify="space-between">
      <Flex>
        <Icon
          w={20}
          h={20}
          rounded="lg"
          mr={3}
          as={AvatarIcon}
          _hover={{
            cursor: 'pointer',
          }}
          onClick={modalTitle.onOpen}
        />
        <Flex
          gap={4}
          alignItems="flex-start"
          w="full"
          flexDir="column"
          justifyContent="space-between"
        >
          <Flex gap={3} direction="column">
            <Text fontWeight="semibold" fontSize={['md', 'lg']} color="white">
              {domain?.startsWith('@') ? domain : `@${domain}`}
            </Text>

            <Button variant="ghosted" color="grey.100" leftIcon={<FlagIcon />}>
              Set as primary Handles
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <CloseButton
        onClick={onClose}
        _hover={{
          cursor: 'pointer',
          color: 'button.500',
        }}
      />
      <EditProfilePicModal
        isOpen={modalTitle.isOpen}
        onClose={modalTitle.onClose}
      />
    </Flex>
  );
};

const ModalFiltersButtons = () => {
  return (
    <Flex gap={2} my={4} w="full" justifyContent="space-between">
      <Button
        h={12}
        variant="outline"
        fontWeight={500}
        rounded="md"
        w="full"
        color="grey.100"
        _hover={{
          bgColor: 'transparent',
          color: 'button.500',
          borderColor: 'button.500',
        }}
      >
        All
      </Button>
      <Button
        h={12}
        variant="outline"
        fontWeight={500}
        rounded="md"
        w="full"
        color="grey.100"
        _hover={{
          bgColor: 'transparent',
          color: 'button.500',
          borderColor: 'button.500',
        }}
      >
        Added
      </Button>
      <Button
        h={12}
        variant="outline"
        fontWeight={500}
        rounded="md"
        w="full"
        color="grey.100"
        _hover={{
          bgColor: 'transparent',
          color: 'button.500',
          borderColor: 'button.500',
        }}
      >
        Not Added
      </Button>
    </Flex>
  );
};

export interface IMetadata {
  key: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface IModalFilterTabsProps {
  metadata: Metadata[];
}

const ModalFiltersTabs = ({ metadata }: IModalFilterTabsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeMetadata, setActiveMetadata] = useState<IMetadata | null>(null);

  const handleOpenModal = (metadata: IMetadata) => {
    setActiveMetadata(metadata);
    onOpen();
  };

  const handleCloseModal = () => {
    setActiveMetadata(null);
    onClose();
  };

  const userMetadata = useMemo(() => {
    return metadata.reduce((obj: Record<string, IMetadata>, item: Metadata) => {
      obj[item.key] = {
        key: item.key,
        title: item.value, // Aqui você pode substituir por qualquer valor que você queira para o título
        description: item.value,
      };
      return obj;
    }, {});
  }, [metadata]);

  return (
    <Tabs position="relative" borderColor="disabled.500">
      <TabList w="full" color="disabled.500">
        {TabsTypes.map((tab) => (
          <Tab
            key={tab.key}
            _selected={{
              color: 'section.200',
            }}
            w="full"
          >
            {tab.name}
          </Tab>
        ))}
      </TabList>
      <TabIndicator
        mt="-1.5px"
        height="2px"
        bg="section.200"
        borderRadius="1px"
      />
      <TabPanels h={520}>
        <TabPanel w="full" px={0}>
          <Flex display="flex" flexDirection="column" gap={4}>
            <Text color="section.500">General</Text>
            <Flex display="flex" gap={4}>
              {Metadatas.General.map((metadata) => {
                const isVerified =
                  metadata.key in userMetadata
                    ? !!userMetadata[metadata.key]
                    : null;

                return (
                  <>
                    <MetadataCard
                      key={metadata.key}
                      icon={metadata.icon}
                      title={metadata.title}
                      verified={isVerified}
                      onClick={() => handleOpenModal(metadata)}
                    />

                    {activeMetadata && activeMetadata.key === metadata.key && (
                      <EditProfileFieldsModal
                        key={metadata.key}
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                        type={metadata.key}
                        title={
                          isVerified ? userMetadata[metadata.key].title : ''
                        }
                        validated={isVerified}
                      />
                    )}
                  </>
                );
              })}
            </Flex>
          </Flex>
          <Flex display="flex" mt={8} flexDirection="column" gap={4}>
            <Text color="section.500">Social</Text>
            <Flex display="flex" gap={4} wrap="wrap">
              {Metadatas.Social.map((metadata) => {
                const isVerified =
                  metadata.key in userMetadata
                    ? !!userMetadata[metadata.key]
                    : null;
                return (
                  <>
                    <MetadataCard
                      key={metadata.key}
                      icon={metadata.icon}
                      title={metadata.title}
                      verified={isVerified}
                      onClick={() => handleOpenModal(metadata)}
                    />

                    {activeMetadata && activeMetadata.key === metadata.key && (
                      <EditProfileFieldsModal
                        key={metadata.key}
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                        type={metadata.key}
                        title={
                          isVerified ? userMetadata[metadata.key].title : ''
                        }
                        validated={isVerified}
                      />
                    )}
                  </>
                );
              })}
            </Flex>
          </Flex>
        </TabPanel>
        <TabPanel w="full" px={0}>
          <Flex display="flex" flexDirection="column" gap={4}>
            <Text color="section.500">Social</Text>
            <Flex display="flex" gap={4} wrap="wrap">
              {Metadatas.Social.map((metadata) => (
                <MetadataCard
                  key={metadata.key}
                  icon={metadata.icon}
                  title={metadata.title}
                  verified={metadata.validated}
                  onClick={() => {}}
                />
              ))}
            </Flex>
          </Flex>
        </TabPanel>
        <TabPanel w="full" px={0}>
          <Flex display="flex" flexDirection="column" gap={4}>
            <Text color="section.500">Addresses</Text>
            <Flex display="flex" gap={4} wrap="wrap">
              {Metadatas.Address.map((metadata) => (
                <MetadataCard
                  key={metadata.key}
                  icon={metadata.icon}
                  title={metadata.title}
                  verified={metadata.validated}
                  onClick={() => {}}
                />
              ))}
            </Flex>
          </Flex>
        </TabPanel>
        <TabPanel w="full" px={0}>
          <Flex display="flex" flexDirection="column" gap={4}>
            <Text color="section.500">Website</Text>
            <Flex display="flex" gap={4} wrap="wrap">
              {Metadatas.Website.map((metadata) => (
                <MetadataCard
                  key={metadata.key}
                  icon={metadata.icon}
                  title={metadata.title}
                  verified={metadata.validated}
                  onClick={() => {}}
                />
              ))}
            </Flex>
          </Flex>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export const EditProfileModal = ({
  isOpen,
  onClose,
}: EditProfileModalProps) => {
  const { domain } = useParams({ strict: false });
  const { wallet } = useWallet();
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const updates = Metadatas.General;
  const transactionDetails = useDisclosure();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(async () => {
    if (!wallet) return;
    const userMetadata = UserMetadataContract.initialize(wallet, domain);

    await userMetadata.getAll().then((metadata) => {
      setMetadata(metadata);
    });
  }, [wallet, domain, metadata.length]);

  return (
    <>
      <Dialog.Modal
        closeOnOverlayClick={false}
        hideCloseButton
        isOpen={isOpen}
        onClose={onClose}
        modalTitle={<ModalTitle onClose={onClose} />}
      >
        <Dialog.Body>
          <ModalFiltersButtons />
          <ModalFiltersTabs metadata={metadata} />
        </Dialog.Body>

        <Dialog.Actions>
          <Dialog.SecondaryAction onClick={onClose}>
            Cancel
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction onClick={transactionDetails.onOpen}>
            Save changes
          </Dialog.PrimaryAction>
        </Dialog.Actions>
      </Dialog.Modal>
      <TransactionsDetailsModal
        domain={domain}
        isOpen={transactionDetails.isOpen}
        onClose={transactionDetails.onClose}
        updates={updates}
        onConfirm={transactionDetails.onClose}
      />
    </>
  );
};
