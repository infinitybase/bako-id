// import {
//   UserMetadataContract,
//   setPrimaryHandle,
//   type Metadata,
// } from '@bako-id/sdk';
import {
  Box,
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
  useMediaQuery,
} from '@chakra-ui/react';
import { useWallet } from '@fuels/react';

import { useParams } from '@tanstack/react-router';
import type { Account } from 'fuels';
import React, { useMemo, useState, type ReactNode } from 'react';
import {
  type MetadataKeyValue,
  type MetadataResponse,
  useMetadata,
} from '../../hooks/useMetadata';
import { Metadatas } from '../../utils/metadatas';
import { MetadataCard } from '../card/metadataCard';
import { Dialog } from '../dialog';
import { AvatarIcon } from '../icons';
import { EditProfileFieldsModal } from './editProfileFieldsModal';
import { EditProfilePicModal } from './editProfilePicModal';
import { TransactionsDetailsModal } from './transactionDetails';

interface Metadata {
  key: string;
  value: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: MetadataResponse;
  handleOnSuccess: () => void;
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
  updates: Metadata[];
  setUpdates: React.Dispatch<React.SetStateAction<MetadataKeyValue[]>>;
}

interface MetadataTabPanelProps {
  title: string;
  metadatas: typeof Metadatas.Social;
  userMetadata: Record<string, IMetadata>;
  updates: Metadata[];
  setUpdates: React.Dispatch<React.SetStateAction<MetadataKeyValue[]>>;
  filters: FilterButtonTypes;
}

enum FilterButtonTypes {
  ALL = 'All',
  ADDED = 'Added',
  NOT_ADDED = 'Not Added',
}

interface IModalFiltersButtonsProps {
  changeFilter: (filter: FilterButtonTypes) => void;
  filter: FilterButtonTypes;
}

const TabsTypes = [
  { key: 'General', name: 'General' },
  { key: 'Social', name: 'Social' },
  { key: 'Address', name: 'Address' },
  { key: 'Website', name: 'Website' },
  // { key: 'Other', name: 'Other' },
];

const ModalTitle = ({
  onClose,
  avatar,
}: Pick<EditProfileModalProps, 'onClose'> & {
  wallet: Account;
  avatar?: string;
}) => {
  const modalTitle = useDisclosure();
  const { domain } = useParams({ strict: false });
  // const { data: handles, refetch: refetchHandles } = useMyHandles();
  // const { successToast } = useCustomToast();

  // const _handle = handles?.find((handle) => handle.name === domain);

  // const setPrimaryHandleMutation = useMutation({
  //   mutationKey: ['setPrimaryHandle'],
  //   mutationFn: async () => {
  //     // await setPrimaryHandle({
  //     //   account: wallet,
  //     //   domain: handle?.name ?? domain,
  //     // })
  //   },
  //   onSuccess: () => {
  //     successToast({
  //       title: 'Primary Handle Set',
  //       description:
  //         'You have successfully set this handle as your primary handle',
  //     });
  //     refetchHandles();
  //   },
  //   onError: (error) => {
  //     console.error(error.message);
  //   },
  // });

  // const _handleSetPrimaryHandle = async () => {
  //   await setPrimaryHandleMutation.mutate();
  // };

  return (
    <Flex w="full" justify="space-between">
      <Flex>
        {avatar ? (
          <Box
            w={48}
            h={28}
            rounded="lg"
            mr={4}
            bgImage={`url(${avatar})`}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            border="1.5px solid"
            borderColor={'button.500'}
          />
        ) : (
          <Icon
            w={[16, 16, 16, 20]}
            h={[16, 16, 16, 20]}
            rounded="lg"
            mr={3}
            as={AvatarIcon}
            // _hover={{
            //   cursor: 'pointer',
            // }}
            // onClick={modalTitle.onOpen}
          />
        )}
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

            {/*{handle?.isPrimary ? (*/}
            {/*  <Button*/}
            {/*    variant="ghosted"*/}
            {/*    h={[8, 8, 8, 10]}*/}
            {/*    _hover={{*/}
            {/*      cursor: 'inherit',*/}
            {/*    }}*/}
            {/*    color="button.500"*/}
            {/*    bg="warning.750"*/}
            {/*    fontSize={['sm', 'sm', 'sm', 'md']}*/}
            {/*    leftIcon={<FlagIconFilled w={5} h={5} color="button.500" />}*/}
            {/*  >*/}
            {/*    Your primary Handles*/}
            {/*  </Button>*/}
            {/*) : (*/}
            {/*  <Button*/}
            {/*    variant="ghosted"*/}
            {/*    h={[8, 8, 8, 10]}*/}
            {/*    color="grey.100"*/}
            {/*    fontSize={['sm', 'sm', 'sm', 'md']}*/}
            {/*    leftIcon={<FlagIcon />}*/}
            {/*    onClick={handleSetPrimaryHandle}*/}
            {/*  >*/}
            {/*    Set as primary Handles*/}
            {/*  </Button>*/}
            {/*)}*/}
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

const ModalFiltersButtons = ({
  changeFilter,
  filter,
}: IModalFiltersButtonsProps) => {
  const filterTypes = [
    { type: FilterButtonTypes.ALL, label: 'All' },
    { type: FilterButtonTypes.ADDED, label: 'Added' },
    { type: FilterButtonTypes.NOT_ADDED, label: 'Not Added' },
  ];

  return (
    <Flex gap={2} my={4} w="full" justifyContent="space-between">
      {filterTypes.map((filterType) => (
        <Button
          key={filterType.type}
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
          _active={{
            bgColor: 'transparent',
            color: 'button.500',
            borderColor: 'button.500',
          }}
          isActive={filter === filterType.type}
          onClick={() => changeFilter(filterType.type)}
        >
          {filterType.label}
        </Button>
      ))}
    </Flex>
  );
};

const MetadataTabPanel = ({
  title,
  metadatas,
  updates,
  setUpdates,
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
                  : updates.some((update) => update.key === metadata.key)
                    ? false
                    : null;

              const isEmpty = !userMetadata[metadata.key];
              const isUpdated = !!updates.find(
                ({ key }) => key === metadata.key
              );

              return (
                <React.Fragment key={metadata.key}>
                  <MetadataCard
                    key={metadata.key}
                    keys={metadata.key}
                    icon={metadata.icon}
                    title={metadata.title}
                    isEmpty={isEmpty}
                    isUpdated={isUpdated}
                    onClick={() => handleOpenModal(metadata)}
                  />

                  {activeMetadata && activeMetadata.key === metadata.key && (
                    <EditProfileFieldsModal
                      key={metadata.key}
                      isOpen={isOpen}
                      onClose={handleCloseModal}
                      updates={updates}
                      setUpdates={setUpdates}
                      type={metadata.key}
                      title={
                        isVerified ? userMetadata[metadata.key]?.title : ''
                      }
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

const ModalFiltersTabs = ({
  metadata,
  updates,
  setUpdates,
  filters,
}: IModalFilterTabsProps) => {
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

  const [maxH680] = useMediaQuery('(max-height: 680px)');
  const [maxH860] = useMediaQuery('(max-height: 860px)');

  const calculateHeight = () => {
    if (maxH680) return 300;
    if (maxH860) return 400;
    return 420;
  };

  return (
    <Tabs position="relative" borderColor="disabled.500">
      <TabList w="full" color="disabled.500">
        {TabsTypes.map((tab) => (
          <Tab key={tab.key} _selected={{ color: 'section.200' }} w="full">
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
        h={calculateHeight()}
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
            updates={updates}
            metadatas={Metadatas.General}
            userMetadata={userMetadata}
            setUpdates={setUpdates}
            filters={filters}
          />
          <MetadataTabPanel
            title="Social"
            updates={updates}
            metadatas={Metadatas.Social}
            userMetadata={userMetadata}
            setUpdates={setUpdates}
            filters={filters}
          />
        </TabPanel>
        <TabPanel w="full" px={0}>
          <MetadataTabPanel
            title="Social"
            updates={updates}
            metadatas={Metadatas.Social}
            userMetadata={userMetadata}
            setUpdates={setUpdates}
            filters={filters}
          />
        </TabPanel>
        <TabPanel w="full" px={0}>
          <MetadataTabPanel
            title="Addresses"
            updates={updates}
            metadatas={Metadatas.Address}
            userMetadata={userMetadata}
            setUpdates={setUpdates}
            filters={filters}
          />
        </TabPanel>
        <TabPanel w="full" px={0}>
          <MetadataTabPanel
            title="Website"
            updates={updates}
            metadatas={Metadatas.Website}
            userMetadata={userMetadata}
            setUpdates={setUpdates}
            filters={filters}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export const EditMetadataModal = ({
  isOpen,
  onClose,
  handleOnSuccess,
}: EditProfileModalProps) => {
  const { domain } = useParams({ strict: false });
  const { wallet } = useWallet();
  const {
    handleSaveRequest,
    metadata,
    transactionModal,
    updatedMetadata,
    setUpdatedMetadata,
  } = useMetadata(handleOnSuccess);

  const avatar = metadata?.find((meta) => meta.key === 'avatar')?.value;

  const [filter, setFilter] = useState(FilterButtonTypes.ALL);

  const handleFilterClick = (newFilter: FilterButtonTypes) => {
    setFilter(newFilter);
  };

  return (
    <>
      <Dialog.Modal
        closeOnOverlayClick={false}
        hideCloseButton
        isOpen={isOpen}
        onClose={onClose}
        size={['full', '2xl', '2xl', '2xl']}
        modalTitle={
          <ModalTitle avatar={avatar} onClose={onClose} wallet={wallet!} />
        }
      >
        <ModalFiltersButtons changeFilter={handleFilterClick} filter={filter} />

        <Dialog.Body>
          <ModalFiltersTabs
            metadata={(metadata ?? []) as Metadata[]}
            updates={updatedMetadata}
            setUpdates={setUpdatedMetadata}
            filters={filter}
          />
        </Dialog.Body>

        <Dialog.Actions>
          <Dialog.SecondaryAction onClick={onClose}>
            Cancel
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction
            onClick={transactionModal.onOpen}
            disabled={updatedMetadata?.length === 0}
          >
            Save changes
          </Dialog.PrimaryAction>
        </Dialog.Actions>
      </Dialog.Modal>

      <TransactionsDetailsModal
        domain={domain}
        isOpen={transactionModal.isOpen}
        onClose={transactionModal.onClose}
        updates={updatedMetadata}
        onConfirm={handleSaveRequest.mutate}
        updateInProgress={handleSaveRequest.isPending}
      />
    </>
  );
};
