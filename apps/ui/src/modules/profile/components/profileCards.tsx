import {
  Box,
  Center,
  CloseButton,
  Flex,
  type FlexProps,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Image,
  Skeleton,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { type ReactNode, Suspense, useMemo } from 'react';
import { AccountsCard } from '../../../components/card/accountsCard.tsx';
import { AddressesCard } from '../../../components/card/addressesCard.tsx';
import { OwnershipCard } from '../../../components/card/ownershipCard.tsx';
import { ProfileCard } from '../../../components/card/profileCard.tsx';
import { ProfileCardLoadingSkeleton } from './profileCardLoadingSkeleton.tsx';

import { useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { isB256 } from 'fuels';
import nftEmpty from '../../../assets/nft-empty.png';
import { Card, Dialog } from '../../../components';
import { CopyText } from '../../../components/helpers/copy.tsx';
import { BTCIcon } from '../../../components/icons/btcicon.tsx';
import { ContractIcon } from '../../../components/icons/contracticon.tsx';
import { EditMetadataModal } from '../../../components/modal/editProfileModal.tsx';
import { useMetadata } from '../../../hooks/useMetadata.ts';
import {
  type FuelAsset,
  FuelAssetService,
} from '../../../services/fuel-assets.ts';
import { formatAddress } from '../../../utils/formatter.ts';
import { getExplorer } from '../../../utils/getExplorer.ts';

type ProfileCardsProps = {
  domainParam: string;
  domain: string;
  owner: string;
  isLoading: boolean;
  isExternal?: boolean;
};

const NFTText = ({
  value,
  title,
  isCopy,
  icon,
  ...rest
}: {
  value: string;
  title: string;
  icon?: ReactNode;
  isCopy?: boolean;
} & FlexProps) => (
  <Flex
    flex={1}
    w="full"
    p={3}
    gap={3}
    alignItems="center"
    borderRadius="md"
    background="input.600"
    {...rest}
  >
    {icon && <Icon fontSize={25}>{icon}</Icon>}
    <Box>
      <Text fontSize="xs" color="section.500">
        {title}
      </Text>
      <Flex gap={2}>
        <Text fontSize="xs">
          {isB256(value!) ? formatAddress(value!, 9) : value}
        </Text>
        {isCopy && <CopyText value={value!} />}
      </Flex>
    </Box>
  </Flex>
);
const NFTCard = (props: { asset: FuelAsset }) => {
  const { name, contractId, assetId, metadata, uri, symbol } = props.asset;
  const dialog = useDisclosure();

  const image = useMemo(() => {
    let imageUri = nftEmpty;

    if (metadata) {
      const imageKeys = ['image', 'URI', 'uri'];
      const imageKey = Object.keys(metadata).find((key) =>
        imageKeys.includes(key.split(':').at(0)!)
      );
      imageUri = metadata[imageKey!] ?? imageUri;
    } else if (uri) {
      // TODO: Check uri is an image
      imageUri = uri;
    }

    return imageUri;
  }, [uri, metadata]);

  const metadataArray = useMemo(() => {
    return Object.entries(metadata ?? {}).map(([key, value]) => ({
      key,
      value,
    }));
  }, [metadata]);

  return (
    <>
      <Dialog.Modal
        hideHeader
        size={{
          base: 'full',
          md: '4xl',
        }}
        onClose={dialog.onClose}
        isOpen={dialog.isOpen}
      >
        <Dialog.Body
          id="asdasdasd"
          h="full"
          display="flex"
          flexDirection={{
            base: 'column-reverse',
            md: 'row',
          }}
          alignItems={{
            base: 'center',
            lg: 'flex-start',
          }}
        >
          <Box
            w={{
              base: 'full',
              md: 'auto',
            }}
            maxW={{
              base: 'full',
              sm: '400px',
            }}
          >
            <Image
              w="full"
              minW={{
                base: 'auto',
                md: '400px',
              }}
              src={image}
              alt="NFT image"
              borderRadius="xl"
            />
            <Flex direction="row" wrap="wrap" gap={3} mt={3}>
              <NFTText
                icon={<BTCIcon />}
                value={assetId}
                title="Asset ID"
                isCopy
              />

              <NFTText
                icon={<ContractIcon />}
                value={contractId!}
                title="Contract Address"
                isCopy
              />
            </Flex>
          </Box>
          <VStack
            w="full"
            justifyContent="space-between"
            alignItems="flex-start"
            ml={{
              base: 0,
              md: 6,
            }}
          >
            <Box w="full" position="relative">
              <Heading fontSize="xl">
                {name && symbol && `${symbol} ${name}`}
                {!name && formatAddress(assetId)}
              </Heading>
              <CloseButton
                onClick={dialog.onClose}
                w="min-content"
                h="min-content"
                position="absolute"
                top="0"
                right="0"
              />
            </Box>
            <Box flex={1} mt={6} maxH="full" overflowY="hidden">
              <Box mb={6}>
                <Heading fontSize="md">Description</Heading>
                <Text mt={3} fontSize="sm" color="section.500">
                  Description not provided.
                </Text>
              </Box>
              <Box mb={6}>
                <Heading fontSize="md">Metadata</Heading>
                <Flex direction="row" wrap="wrap" gap={3} mt={3}>
                  {metadataArray?.map((m) => (
                    <NFTText key={m.key} value={m.value ?? ''} title={m.key} />
                  ))}
                  {metadataArray.length === 0 && (
                    <Text fontSize="sm" color="section.500">
                      Empty metadata.
                    </Text>
                  )}
                </Flex>
              </Box>
            </Box>
          </VStack>
        </Dialog.Body>
      </Dialog.Modal>
      <Card
        borderRadius="5px"
        overflow={'hidden'}
        onClick={dialog.onOpen}
        minW={133}
        p={0}
      >
        <Image maxW="full" src={image} />
        <Box p={2} w="full">
          <Text fontSize="sm">
            {symbol ?? ''} {name ?? formatAddress(assetId!)}
          </Text>
        </Box>
      </Card>
    </>
  );
};

export const NFTCollections = ({
  resolver,
  chainId = 9889,
}: {
  resolver: string;
  chainId?: number;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['nfts', resolver],
    queryFn: async () => {
      return FuelAssetService.byAddress({
        address: resolver,
        chainId: chainId!,
      });
    },
    select: (data) => data?.filter((a) => !!a.isNFT),
    enabled: !!chainId,
  });

  if (isLoading) {
    return (
      <Card
        w="full"
        h="fit-content"
        display="block"
        alignItems="center"
        backdropFilter="blur(7px)"
      >
        <Flex mb={3} alignItems="center" justify="space-between">
          <Skeleton height="8" width="32" rounded="md" />
        </Flex>
        <HStack overflow="hidden" gap={3}>
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
          <Skeleton w="full" minW={160} h={160} rounded="lg" />
        </HStack>
      </Card>
    );
  }

  return (
    <Card
      w="full"
      h={['fit-content', 'fit-content', 'fit-content', 'auto']}
      display="flex"
      backdropFilter="blur(6px)"
      cursor="pointer"
      flexDirection="column"
      boxShadow="lg"
    >
      <Flex mb={4} alignItems="center" justify="space-between">
        <Heading fontSize="lg">NFT</Heading>
      </Flex>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
        gap={6}
      >
        {data?.map((a) => (
          <NFTCard key={`${a.contractId}-${a.subId}`} asset={a} />
        ))}
        {data?.length === 0 ||
          (isError && (
            <GridItem as={Center} colSpan={5} gridArea="5fr">
              <Text
                color="grey.200"
                fontSize="xs"
                maxW="172px"
                textAlign={'center'}
              >
                It appears this user does not own any NFTs yet.
              </Text>
            </GridItem>
          ))}
      </Grid>
    </Card>
  );
};

export const ProfileCards = ({
  domain,
  domainParam,
  isLoading: loadingDomain,
  owner,
}: ProfileCardsProps) => {
  const { metadataModal, metadata, setUpdatedMetadata, loadingMetadata } =
    useMetadata();

  const loading = loadingDomain || loadingMetadata;

  const handleOnSuccess = () => {
    metadataModal.onClose();
    setUpdatedMetadata([]);
  };

  const { provider } = useProvider();
  const explorerUrl = getExplorer(provider?.getChainId());

  return loading || !owner ? (
    <ProfileCardLoadingSkeleton />
  ) : (
    <Suspense>
      <EditMetadataModal
        isOpen={metadataModal.isOpen}
        onClose={() => {
          metadataModal.onClose();
          setUpdatedMetadata([]);
        }}
        metadata={metadata}
        handleOnSuccess={handleOnSuccess}
      />

      <Stack
        display="flex"
        h="fit-content"
        gap={6}
        direction={{
          base: 'column',
          md: 'row',
        }}
        w="full"
      >
        <Flex w="full" h="full" flexDirection="column" gap={[4, 4, 4, 6]}>
          <ProfileCard
            domainName={domainParam}
            domain={domain ?? ''}
            metadata={metadata}
            editAction={metadataModal.onOpen}
          />

          <Stack
            w="full"
            h="full"
            direction={{
              base: 'column',
              md: 'row',
            }}
            gap={[4, 4, 4, 6]}
          >
            <OwnershipCard
              owner={owner ?? ''}
              explorerUrl={`${explorerUrl}/account/`}
            />

            <AddressesCard
              domain={domain ?? ''}
              explorerUrl={`${explorerUrl}/account/`}
            />
          </Stack>
        </Flex>
        <Flex flex={1}>
          <AccountsCard metadata={metadata} addAction={metadataModal.onOpen} />
        </Flex>
      </Stack>
      <NFTCollections chainId={provider?.getChainId()} resolver={domain} />
    </Suspense>
  );
};
