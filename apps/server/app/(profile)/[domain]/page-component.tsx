'use client';

import { Card } from '@/components/card';
import { ProfileCard } from '@/components/card/profileCard';
import { CopyText } from '@/components/copy';
import { Explorer, ExplorerTypes } from '@/components/explorer';
import { FuelIcon } from '@/components/icons';
import { TextValue } from '@/components/inputs/text';
import { VerifiedAccountInput } from '@/components/inputs/verifiedAccount';
import { ProfileCardSkeleton } from '@/components/skeletons';
import { AccountsCardSkeleton } from '@/components/skeletons/accountsCardSkeleton';
import { AddressCardSkeleton } from '@/components/skeletons/addressCardSkeleton';
import { NFTCollectionSkeleton } from '@/components/skeletons/nftCollectionSkeleton';
import { OwnershipCardSkeleton } from '@/components/skeletons/ownershipCardSkeleton';
import { getExplorer } from '@/getExplorer';
import { formatAddress } from '@/utils';
import { MetadataKeys } from '@bako-id/sdk';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  Heading,
  Icon,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Address, ZeroBytes32 } from 'fuels';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { NftListCollections } from './components/NftListColletions';
import { NftListForSale } from './components/NftListForSale';
import { useProfile } from './hooks';
import { useListOrdersByAddress } from '@/hooks/useListOrdersByAddress';

const ProfileCardLoadingSkeleton = ({
  hiddenCollectionSkeleton = false,
}: { hiddenCollectionSkeleton?: boolean }) => (
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
      mb={3}
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
    {!hiddenCollectionSkeleton && <NFTCollectionSkeleton />}
  </Suspense>
);

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

export function ProfilePage({
  chainId,
  ordersPage,
}: { chainId: number; ordersPage: number }) {
  const params = useParams();
  const domain = (params.domain as string).replace('@', '');

  const [shouwAccounts, setShouwAccounts] = useState(false);

  const { metadata, owner, isLoading, dates, resolver } = useProfile(domain);
  const explorerUrl = getExplorer(chainId);

  const avoidKeys = [MetadataKeys.CONTACT_BIO, MetadataKeys.CONTACT_NICKNAME];

  const getInputIcon = (key: MetadataKeys, value: string) => {
    const url = getMetadataRedirects(key, value);

    if (url) {
      return <Explorer redirectLink={url ?? ''} />;
    }

    return <CopyText value={value} />;
  };

  const metadataAccount =
    metadata?.filter((data) => !avoidKeys.includes(data.key as MetadataKeys)) ??
    [];

  const {
    orders,
    isLoading: isOrdersLoading,
    isPlaceholderData,
  } = useListOrdersByAddress({
    chainId,
    sellerAddress: resolver ?? '',
    page: ordersPage < 0 ? 0 : ordersPage,
    limit: 1,
  });

  const data = orders?.data ?? [];

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
          <ProfileCardLoadingSkeleton
            hiddenCollectionSkeleton={!!data.length}
          />
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
            h="full"
            gap={3}
            alignItems="stretch"
          >
            <Card
              w="full"
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
            position="relative"
            paddingBottom={(metadataAccount.length ?? 0) < 6 ? 0 : 8}
          >
            <Flex alignItems="center" justify="space-between">
              <Heading fontSize="lg">Accounts</Heading>
            </Flex>

            <Collapse
              startingHeight={
                metadataAccount.length === 0 || metadataAccount.length >= 5
                  ? 330
                  : metadataAccount.length * 80
              }
              in={shouwAccounts}
            >
              {metadataAccount.length ? (
                <VStack spacing={5} h="full" mt={6}>
                  {metadata?.map((m) => {
                    const variant = {
                      key: m.key as MetadataKeys,
                      value: m.value,
                    };

                    const externalLink = getMetadataRedirects(
                      variant.key,
                      variant.value!
                    );
                    const onRedirect = () => {
                      if (externalLink) {
                        window.open(externalLink, '_blank');
                      }
                    };

                    return (
                      <VerifiedAccountInput
                        key={m.key}
                        isExternal={!!externalLink}
                        value={m.value}
                        variant={variant}
                        onClick={onRedirect}
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
                <VStack
                  w="full"
                  h={'full'}
                  justify={'center'}
                  py={6}
                  spacing={4}
                >
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
            </Collapse>
            <Button
              leftIcon={
                metadataAccount.length > 6 ? (
                  shouwAccounts ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )
                ) : undefined
              }
              color="section.200"
              bgColor="rgba(243, 242, 241, 0.02)"
              backdropFilter="blur(6px)"
              bottom={4}
              left={0}
              right={0}
              margin="0 auto"
              position="absolute"
              // variant="solid"
              w="min-content"
              boxShadow="lg"
              size="xs"
              _hover={{}}
              _active={{}}
              onClick={() => setShouwAccounts((prevState) => !prevState)}
              hidden={metadataAccount.length < 6}
            >
              {shouwAccounts ? 'Hide Accounts' : 'Show More Accounts'}
            </Button>
          </Card>
        </Box>
      </Stack>
      <Box maxW={1019} w="full">
        <NftListForSale
          chainId={chainId}
          domain={domain}
          orders={data}
          isPlaceholderData={isPlaceholderData}
          isOrdersLoading={isOrdersLoading}
          paginationInfos={{
            totalPages: orders?.totalPages ?? 0,
            hasNextPage: orders?.hasNextPage ?? false,
            hasPreviousPage: orders?.hasPreviousPage ?? false,
          }}
        />
      </Box>
      <Box maxW={1019} w="full">
        <NftListCollections chainId={chainId!} resolver={resolver ?? ''} />
      </Box>
    </Center>
  );
}
