import {
  Box,
  Center,
  CloseButton,
  Flex,
  type FlexProps,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Skeleton,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { isB256 } from 'fuels';
import { type ReactNode, Suspense, useMemo, useState } from 'react';
import nftEmpty from '../../../assets/nft-empty.png';
import { Card, Dialog } from '../../../components';
import { AccountsCard } from '../../../components/card/accountsCard.tsx';
import { AddressesCard } from '../../../components/card/addressesCard.tsx';
import { OwnershipCard } from '../../../components/card/ownershipCard.tsx';
import { ProfileCard } from '../../../components/card/profileCard.tsx';
import { CopyText } from '../../../components/helpers/copy.tsx';
import { BTCIcon } from '../../../components/icons/btcicon.tsx';
import { ContractIcon } from '../../../components/icons/contracticon.tsx';
import { EditMetadataModal } from '../../../components/modal/editProfileModal.tsx';
import { useMetadata } from '../../../hooks/useMetadata.ts';
import { useChainId } from '../../../hooks/useChainId';
import type { FuelAsset } from '../../../services/fuel-assets.ts';
import {
  formatAddress,
  isUrl,
  metadataArrayToObject,
  parseURI,
} from '../../../utils/formatter.ts';
import { getExplorer } from '../../../utils/getExplorer.ts';
import { ProfileCardLoadingSkeleton } from './profileCardLoadingSkeleton.tsx';
import { NFTCollectionSkeleton } from '../../../components/skeletons/nftCollectionSkeleton.tsx';
import { useGetBatchedAssets } from '../../../hooks/useGetBatchedAssets.ts';

type ProfileCardsProps = {
  domainParam: string;
  domain: string;
  owner: string;
  isLoading: boolean;
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
    minW="fit-content"
    w="full"
    p={3}
    gap={3}
    alignItems="center"
    borderRadius="md"
    background="input.600"
    position="relative"
    _before={
      isUrl(value) && ['image', 'avatar'].includes(title.toLowerCase())
        ? {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 0.2,
            backgroundImage: `url('${value}')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: 'md',
          }
        : ''
    }
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

const _blacklistMetadataKeys = ['name', 'image', 'description', 'uri'];

const NFTCard = (props: { asset: FuelAsset & { image?: string } }) => {
  const {
    name,
    contractId,
    assetId,
    metadata: defaultMetadata,
    symbol,
    uri,
  } = props.asset;
  const dialog = useDisclosure();

  const [isLoaded, setIsLoaded] = useState(false);

  const { data: metadata } = useQuery({
    queryKey: ['nft-metadata', assetId],
    queryFn: async (): Promise<Record<string, string>> => {
      let metadata: Record<string, string> = defaultMetadata ?? {};
      const metadataEntries = Object.entries(metadata).filter(
        ([key]) => !key.toLowerCase().includes('uri')
      );

      if (metadataEntries.length === 0 && uri?.endsWith('.json')) {
        const json: Record<string, string> = await fetch(parseURI(uri))
          .then((res) => res.json())
          .catch(() => ({}));
        metadata = json;
      }

      for (const [key, value] of Object.entries(metadata)) {
        if (Array.isArray(value)) {
          const metadataValueRecord = metadataArrayToObject(value, key);
          Object.assign(metadata, metadataValueRecord);
          delete metadata[key];
          continue;
        }

        if (metadata[key] === undefined) {
          const matadataValue = value as string;
          metadata[key] = matadataValue as string;
        }
      }

      return metadata;
    },
    enabled: !!assetId,
  });

  const image = useMemo(() => {
    let imageUri = nftEmpty;

    if (metadata) {
      const imageKeys = ['image'];
      const imageKey = Object.keys(metadata).find((key) =>
        imageKeys.includes(key.split(':').at(0)!)
      );
      const nftImageURI = parseURI(metadata[imageKey!]);
      imageUri = nftImageURI || imageUri;
    }

    return imageUri;
  }, [metadata]);

  const metadataArray = useMemo(() => {
    return Object.entries(metadata ?? {}).map(([key, value]) => ({
      key,
      value,
    }));
  }, [metadata]);

  const hasSrc20Name = name && symbol;

  const nftName = (
    <>
      {hasSrc20Name && `${symbol} ${name}`}
      {!hasSrc20Name && metadata?.name && metadata.name}
      {!hasSrc20Name && !metadata?.name && formatAddress(assetId)}
    </>
  );

  return (
    <>
      <Dialog.Modal
        hideCloseButton
        hideHeader
        size={{
          base: '5xl',
          md: '4xl',
        }}
        onClose={dialog.onClose}
        isOpen={dialog.isOpen}
      >
        <Dialog.Body
          h="full"
          display="flex"
          flexDirection={{
            base: 'column-reverse',
            md: 'row',
          }}
          alignItems={{
            base: 'center',
            md: 'flex-start',
          }}
        >
          <Flex
            flexDir="column"
            justifyContent="space-between"
            h="97%"
            minH={{ base: '445px', sm: '470x' }}
          >
            <Skeleton
              h="full"
              borderRadius="xl"
              isLoaded={isLoaded}
              w={['auto', '398px']}
              minH={['375px', '398px']}
              mx="auto"
            >
              <Image
                w="full"
                src={parseURI(image)}
                alt="NFT image"
                borderRadius="xl"
              />
            </Skeleton>
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
          </Flex>
          <VStack
            maxW="full"
            flex={1}
            justifyContent="space-between"
            alignItems="flex-start"
            ml={{
              base: 0,
              md: 6,
            }}
          >
            <Box w="full" position="relative">
              <Heading fontSize="xl">{nftName}</Heading>
              <CloseButton
                onClick={dialog.onClose}
                w="min-content"
                h="min-content"
                position="absolute"
                top="0"
                right="0"
              />
            </Box>
            <Box
              flex={1}
              mt={6}
              maxH="full"
              overflowY="hidden"
              maxW={{ base: 'full', md: 'xl' }}
            >
              <Box mb={6}>
                <Heading fontSize="md">Description</Heading>
                <Text
                  mt={3}
                  fontSize="sm"
                  color="section.500"
                  wordBreak="break-all"
                >
                  {metadata?.description ?? 'Description not provided.'}
                </Text>
              </Box>
              <Box mb={6}>
                <Heading fontSize="md">Metadata</Heading>
                <Flex
                  w="full"
                  maxH="310px"
                  overflowY="scroll"
                  direction="row"
                  wrap="wrap"
                  gap={3}
                  mt={3}
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
                  {metadataArray
                    ?.filter((m) => !_blacklistMetadataKeys.includes(m.key))
                    .map((m) => (
                      <NFTText
                        key={m.key}
                        value={m.value ?? ''}
                        title={m.key}
                      />
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
      <Card borderRadius="5px" overflow="hidden" onClick={dialog.onOpen} p={0}>
        <Skeleton
          w="full"
          h="full"
          isLoaded={isLoaded}
          minH={['333px', '321px', '124px', '177px']}
        >
          <Image
            maxW="full"
            src={props.asset.image ?? image}
            onLoad={() => setIsLoaded(true)}
          />
        </Skeleton>
        <Box p={2} w="full" mt="auto">
          <Text fontSize="sm">{nftName}</Text>
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
  chainId?: number | null;
}) => {
  const {
    assets: nftCollections,
    isLoadingAssets: isLoading,
    loadMoreRef,
  } = useGetBatchedAssets(resolver, chainId);

  if (isLoading) {
    return <NFTCollectionSkeleton />;
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
      <Flex mb={6} alignItems="center" justify="space-between">
        <Heading fontSize="lg">NFT</Heading>
      </Flex>
      <VStack
        alignItems="flex-start"
        w="full"
        pr={4}
        maxH="470px"
        overflowY="scroll"
        sx={{
          '&::-webkit-scrollbar': {
            width: '3px',
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
        {nftCollections?.map((collection) => (
          <Box key={collection.name} mb={5}>
            <Heading fontSize="md" mb={3}>
              {collection.name}
            </Heading>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              }}
              gap={6}
            >
              {collection.assets?.map((a) => (
                <NFTCard key={a.assetId} asset={a} />
              ))}
            </Grid>
          </Box>
        ))}
        <Box bg="red" minHeight="10px" w="full" ref={loadMoreRef} />
      </VStack>

      {!nftCollections?.length && (
        <GridItem as={Center} py={10} colSpan={5} gridArea="5fr">
          <Text
            color="grey.200"
            fontSize="xs"
            maxW="172px"
            textAlign={'center'}
          >
            It appears this user does not own any NFTs yet.
          </Text>
        </GridItem>
      )}
    </Card>
  );
};

export const ProfileCards = ({
  domain,
  domainParam,
  isLoading: loadingDomain,
  owner,
}: ProfileCardsProps) => {
  const {
    metadataModal,
    metadata,
    setUpdatedMetadata,
    loadingMetadata,
    fetchingMetadata,
  } = useMetadata();

  const loading = loadingDomain || loadingMetadata;

  const handleOnSuccess = () => {
    metadataModal.onClose();
    setUpdatedMetadata([]);
  };
  const { chainId } = useChainId();
  const explorerUrl = getExplorer(chainId);

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
        spacing={6}
        direction={['column', 'column', 'column', 'row']}
        w="full"
      >
        <Flex w="full" h="full" flexDirection="column" gap={[4, 4, 4, 6]}>
          <ProfileCard
            domainName={domainParam}
            domain={domain ?? ''}
            metadata={metadata}
            editAction={metadataModal.onOpen}
            isMetadataLoading={loading || fetchingMetadata}
          />

          <Stack
            w="full"
            h="full"
            direction={['column', 'column', 'column', 'row']}
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
        <AccountsCard metadata={metadata} addAction={metadataModal.onOpen} />
      </Stack>
      <NFTCollections resolver={domain!} chainId={chainId} />
    </Suspense>
  );
};
