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
import React, { useMemo, useState, type ReactNode } from 'react';
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

export interface IMetadata {
  key: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface IModalFilterTabsProps {
  metadata: Metadata[];
  filters: FilterButtonTypes;
}

interface MetadataTabPanelProps {
  title: string;
  metadatas: typeof Metadatas.Social;
  userMetadata: Record<string, IMetadata>;
  filters: FilterButtonTypes;
}

enum FilterButtonTypes {
  ALL = 'All',
  ADDED = 'Added',
  NOT_ADDED = 'Not Added',
}

interface IModalFiltersButtonsProps {
  changeFilter: (filter: FilterButtonTypes) => void;
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
          w={[16, 16, 16, 20]}
          h={[16, 16, 16, 20]}
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
            <Text
              fontWeight="semibold"
              fontSize={['md', 'md', 'md', 'lg']}
              color="white"
            >
              {domain?.startsWith('@') ? domain : `@${domain}`}
            </Text>

            <Button
              variant="ghosted"
              h={[8, 8, 8, 10]}
              color="grey.100"
              fontSize={['sm', 'sm', 'sm', 'md']}
              leftIcon={<FlagIcon />}
            >
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

const ModalFiltersButtons = ({ changeFilter }: IModalFiltersButtonsProps) => {
  return (
    <Flex gap={2} my={4} w="full" justifyContent="space-between">
      <Button
        h={[10, 10, 10, 12]}
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
        onClick={() => changeFilter(FilterButtonTypes.ALL)}
      >
        All
      </Button>
      <Button
        h={[10, 10, 10, 12]}
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
        onClick={() => changeFilter(FilterButtonTypes.ADDED)}
      >
        Added
      </Button>
      <Button
        h={[10, 10, 10, 12]}
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
        onClick={() => changeFilter(FilterButtonTypes.NOT_ADDED)}
      >
        Not Added
      </Button>
    </Flex>
  );
};

const MetadataTabPanel = ({
  title,
  metadatas,
  userMetadata,
  filters,
}: MetadataTabPanelProps) => {
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

  const handleFilters = (metadata: Metadata, filters: FilterButtonTypes) => {
    if (filters === FilterButtonTypes.ALL) return true;
    if (filters === FilterButtonTypes.ADDED)
      return metadata.key in userMetadata;
    if (filters === FilterButtonTypes.NOT_ADDED)
      return !(metadata.key in userMetadata);
  };

  return (
    <TabPanel w="full" px={0}>
      <Flex display="flex" flexDirection="column" gap={4}>
        <Text color="section.500">{title}</Text>
        <Flex display="flex" gap={4} wrap="wrap">
          {metadatas
            .filter((metadata) => {
              return handleFilters({ ...metadata, value: '' }, filters);
            })
            .map((metadata) => {
              const isVerified =
                metadata.key in userMetadata
                  ? !!userMetadata[metadata.key]
                  : null;
              return (
                <React.Fragment key={metadata.key}>
                  <MetadataCard
                    key={metadata.key}
                    keys={metadata.key}
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
                      title={isVerified ? userMetadata[metadata.key].title : ''}
                      validated={isVerified}
                    />
                  )}
                </React.Fragment>
              );
            })}
        </Flex>
      </Flex>
    </TabPanel>
  );
};

const ModalFiltersTabs = ({ metadata, filters }: IModalFilterTabsProps) => {
  const userMetadata = useMemo(() => {
    return metadata.reduce((obj: Record<string, IMetadata>, item: Metadata) => {
      obj[item.key] = {
        key: item.key,
        title: item.value,
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
      <TabPanels
        h={[300, 300, 350, 520]}
        maxH={[300, 300, 350, 520]}
        overflowY="scroll"
        overflowX="hidden"
        css={{
          '&::-webkit-scrollbar': {
            width: 0,
            background: 'transparent',
          },
        }}
      >
        <TabPanel w="full" px={0}>
          <MetadataTabPanel
            title="General"
            metadatas={Metadatas.General}
            userMetadata={userMetadata}
            filters={filters}
          />
          <MetadataTabPanel
            title="Social"
            metadatas={Metadatas.Social}
            userMetadata={userMetadata}
            filters={filters}
          />
        </TabPanel>
        <TabPanel w="full" px={0}>
          <MetadataTabPanel
            title="Social"
            metadatas={Metadatas.Social}
            userMetadata={userMetadata}
            filters={filters}
          />
        </TabPanel>
        <TabPanel w="full" px={0}>
          <MetadataTabPanel
            title="Addresses"
            metadatas={Metadatas.Address}
            userMetadata={userMetadata}
            filters={filters}
          />
        </TabPanel>
        <TabPanel w="full" px={0}>
          <MetadataTabPanel
            title="Website"
            metadatas={Metadatas.Website}
            userMetadata={userMetadata}
            filters={filters}
          />
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
  const [filter, setFilter] = useState(FilterButtonTypes.ALL);

  const handleFilterClick = (newFilter: FilterButtonTypes) => {
    setFilter(newFilter);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(async () => {
    if (!wallet) return;
    const userMetadata = UserMetadataContract.initialize(wallet, domain);

    await userMetadata.getAll().then((metadata) => {
      setMetadata(metadata);
    });
  }, [wallet, domain, metadata.length]);

  // console.log(metadata);
  return (
    <>
      <Dialog.Modal
        closeOnOverlayClick={false}
        hideCloseButton
        isOpen={isOpen}
        onClose={onClose}
        size={['full', '2xl', '2xl', '2xl']}
        modalTitle={<ModalTitle onClose={onClose} />}
      >
        <ModalFiltersButtons changeFilter={handleFilterClick} />
        <Dialog.Body>
          <ModalFiltersTabs metadata={metadata} filters={filter} />
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
