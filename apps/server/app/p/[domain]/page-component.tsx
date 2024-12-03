'use client';

import nftEmpty from '@/assets/nft-empty.png';
import { Card } from '@/components/card';
import { ProfileCard } from '@/components/card/profileCard';
import { CopyText } from '@/components/copy';
import { Dialog } from '@/components/dialog';
import { Explorer, ExplorerTypes } from '@/components/explorer';
import { FuelIcon } from '@/components/icons';
import { BTCIcon } from '@/components/icons/btcicon';
import { ContractIcon } from '@/components/icons/contracticon';
import { TextValue } from '@/components/inputs/text';
import { VerifiedAccountInput } from '@/components/inputs/verifiedAccount';
import { ProfileCardSkeleton } from '@/components/skeletons';
import { AccountsCardSkeleton } from '@/components/skeletons/accountsCardSkeleton';
import { AddressCardSkeleton } from '@/components/skeletons/addressCardSkeleton';
import { OwnershipCardSkeleton } from '@/components/skeletons/ownershipCardSkeleton';
import { type FuelAsset, FuelAssetService } from '@/services/fuel-assets';
import { formatAddress } from '@/utils';
import { MetadataKeys } from '@bako-id/sdk';
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
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Address, ZeroBytes32, isB256 } from 'fuels';
import { useParams } from 'next/navigation';
import { type ReactNode, Suspense, useMemo } from 'react';
import { useProfile } from './hooks';

const isUrl = (url: string) => url.startsWith('https');

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
    position="relative"
    _before={
      isUrl(value)
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

const ProfileCardLoadingSkeleton = () => (
  <Suspense>
    <Stack
      display="flex"
      h="fit-content"
      spacing={6}
      direction={{
        base: 'column',
        md: 'row',
      }}
      w="full"
    >
      <Flex w="full" h="full" flexDirection="column" gap={[4, 4, 4, 6]}>
        <ProfileCardSkeleton />

        <Stack
          w="full"
          h="full"
          direction={{
            base: 'column',
            md: 'row',
          }}
          gap={[4, 4, 4, 6]}
        >
          <OwnershipCardSkeleton />
          <AddressCardSkeleton />
        </Stack>
      </Flex>
      <AccountsCardSkeleton />
    </Stack>
  </Suspense>
);

const NFTCard = (props: { asset: FuelAsset }) => {
  const { name, contractId, assetId, metadata, uri, symbol } = props.asset;
  const dialog = useDisclosure();

  const image = useMemo(() => {
    let imageUri = nftEmpty.src;

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
            md: 'flex-start',
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

const getMetadataRedirects = (
  key: MetadataKeys,
  value: string
): string | null => {
  const metaDatas: Partial<Record<MetadataKeys, string>> = {
    'social:x': `https://x.com/${value}`,
    'social:github': `https://github.com/${value}`,
    'social:telegram': `https://t.me/${value}`,
    'contact:website': value,
    'ens:domain': `https://app.ens.domains/${value}`,
  };

  return metaDatas[key] || null;
};

export function ProfilePage() {
  const params = useParams();
  const domain = (params.domain as string).replace('@', '');

  const { metadata, owner, isLoading, explorerUrl, dates, resolver, provider } =
    useProfile(domain);

  const avoidKeys = [MetadataKeys.CONTACT_BIO, MetadataKeys.CONTACT_NICKNAME];

  const getInputIcon = (key: MetadataKeys, value: string) => {
    const url = getMetadataRedirects(key, value);

    if (url) {
      return <Explorer redirectLink={url ?? ''} />;
    }

    return <CopyText value={value} />;
  };

  return (
    <Center
      py={{
        base: 3,
        md: 16,
      }}
      px={{
        base: 3,
        md: 0,
      }}
      overflowY="scroll"
      justifyContent="flex-start"
      flexDirection="column"
      w="full"
      h="full"
      gap={3}
    >
      {isLoading && (
        <Box w="full" maxW={1019}>
          <ProfileCardLoadingSkeleton />
        </Box>
      )}
      <Stack
        hidden={isLoading}
        direction={{
          base: 'column',
          md: 'row',
        }}
        w="full"
        maxW={1019}
        gap={3}
        alignItems="flex-start"
      >
        <Flex direction={'column'} w="full" gap={3} flex={2}>
          <ProfileCard
            explorerUrl={explorerUrl}
            metadata={metadata}
            domain={resolver!}
            domainName={domain}
          />
          <Stack
            direction={{
              base: 'column',
              sm: 'row',
            }}
            gap={3}
            alignItems="flex-start"
          >
            <Card
              w="full"
              h="full"
              p={6}
              display="flex"
              backdropFilter="blur(7px)"
              flexDirection="column"
              gap={6}
            >
              <Flex alignItems="center" justify="space-between">
                <Heading fontSize="lg">Ownership</Heading>
              </Flex>
              <Flex
                direction="column"
                alignItems="flex-start"
                justifyContent="space-between"
                gap={3}
              >
                <TextValue
                  leftAction={'owner'}
                  rightAction={
                    <Explorer
                      id={owner ?? ''}
                      type={ExplorerTypes.ASSETS}
                      explorerUrl={explorerUrl}
                    />
                  }
                  content={
                    owner ? formatAddress(Address.fromB256(owner).toB256()) : ''
                  }
                />
                <Skeleton isLoaded={!isLoading} w="full" rounded="lg">
                  <TextValue
                    leftAction={'expiry'}
                    textAlign="right"
                    rightAction={
                      <CopyText
                        value={
                          // @ts-ignore
                          dates?.ttl ? format(dates.ttl, 'MMMM dd, yyyy') : ''
                        }
                      />
                    }
                    content={
                      // @ts-ignore
                      dates?.ttl ? format(dates.ttl, 'MMMM dd, yyyy') : ''
                    }
                  />
                </Skeleton>
              </Flex>
            </Card>
            <Card
              w="full"
              h="full"
              p={6}
              display="flex"
              backdropFilter="blur(7px)"
              flexDirection="column"
              gap={6}
            >
              <Flex alignItems="center" justify="space-between">
                <Heading fontSize="lg">Addresses</Heading>
              </Flex>
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <TextValue
                  leftAction={<Icon as={FuelIcon} />}
                  rightAction={
                    <CopyText
                      value={Address.fromB256(resolver ?? ZeroBytes32).toB256()}
                    />
                  }
                  content={formatAddress(
                    Address.fromB256(resolver ?? ZeroBytes32).toB256()
                  )}
                />
              </Flex>
            </Card>
          </Stack>
        </Flex>
        <Box w="full" h="full" flex={1}>
          <Card
            w="full"
            h="full"
            display="flex"
            backdropFilter="blur(6px)"
            flexDirection="column"
          >
            <Flex alignItems="center" justify="space-between">
              <Heading fontSize="lg">Accounts</Heading>
            </Flex>

            {metadata?.filter(
              (data) => !avoidKeys.includes(data.key as MetadataKeys)
            ).length ? (
              <VStack spacing={5} h="full" mt={6}>
                {metadata?.map((m) => {
                  const variant = {
                    key: m.key as MetadataKeys,
                    value: m.value,
                  };

                  return (
                    <VerifiedAccountInput
                      key={m.key}
                      value={m.value}
                      variant={variant}
                      isVerified
                      rightAddon
                      rightAddonName={getInputIcon(
                        m.key as MetadataKeys,
                        m.value ?? ''
                      )}
                    />
                  );
                })}
              </VStack>
            ) : (
              <VStack w="full" h={'full'} justify={'center'} py={6} spacing={4}>
                <Text
                  color="grey.200"
                  fontSize="xs"
                  maxW="172px"
                  textAlign={'center'}
                >
                  It seems like this user hasn’t added any account yet
                </Text>
              </VStack>
            )}
          </Card>
        </Box>
      </Stack>
      <Box maxW={1019} w="full">
        <NFTCollections
          chainId={provider?.getChainId()}
          resolver={resolver ?? ''}
        />
      </Box>
    </Center>
  );
}
