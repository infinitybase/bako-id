import {
  Button,
  Flex,
  Icon,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';

import { useAccount } from '@fuels/react';
import { useMemo } from 'react';
import { Card } from '.';
import { ExplorerTypes } from '../../types';
import {
  AvatarIcon,
  DisabledXBadgeIcon,
  EditIcon,
  ExploreIcon,
  FarcasterBadgeIcon,
} from '../icons';

interface Metadata {
  key: string;
  value: string;
}

interface IProfileCard {
  domainName: string | null;
  domain: string;
  metadata: Metadata[] | undefined;
  owner: string;
}

export const ProfileCard = ({ domain, domainName, owner }: IProfileCard) => {
  const action = useDisclosure();
  const { account } = useAccount();
  const [isLowerThanMobile] = useMediaQuery('(max-width: 25em)');

  const isOwner = useMemo(() => {
    return owner === account;
  }, [owner, account]);

  // const nickname = metadata?.find(
  //   (m) => m.key === ContactMetadataKeys.Nickname
  // );
  // const shortBio = metadata?.find((m) => m.key === ContactMetadataKeys.Bio);

  // const handle = handles?.find((handle) => handle.name === domainName);

  return (
    <Card
      w="full"
      h="fit-content"
      alignItems="flex-start"
      backdropFilter="blur(7px)"
      justifyContent="space-between"
      gap={4}
    >
      <Flex w="full">
        <Icon w={32} h={32} rounded="lg" mr={4} as={AvatarIcon} />
        <Flex
          gap={4}
          alignItems={isLowerThanMobile ? 'flex-start' : 'flex-start'}
          w="full"
          flexDir={isLowerThanMobile ? 'column' : 'row'}
          justifyContent="space-between"
        >
          <Flex gap={2.5} direction="column" alignItems="flex-start">
            <Text fontWeight="semibold" fontSize={['md', 'lg']} color="white">
              {domainName?.startsWith('@') ? domainName : `@${domainName}`}
            </Text>

            {/*{nickname?.value && (*/}
            {/*  <Text fontSize={['sm', 'md']} color="grey.200" ml={0.5}>*/}
            {/*    {nickname.value}*/}
            {/*  </Text>*/}
            {/*)}*/}

            <Flex gap={1} ml={0}>
              <FarcasterBadgeIcon w={8} h={8} />
              <DisabledXBadgeIcon w={8} h={8} />
            </Flex>
          </Flex>
          <Flex flexDir="column" gap={2}>
            {/*{handle?.isPrimary && (*/}
            {/*  <Box*/}
            {/*    bgColor="warning.750"*/}
            {/*    p={2}*/}
            {/*    rounded="lg"*/}
            {/*    display="flex"*/}
            {/*    gap={2}*/}
            {/*    alignItems="center"*/}
            {/*    alignSelf={['inherit', 'flex-end']}*/}
            {/*  >*/}
            {/*    <Text fontSize={['sm', 'md']} color="button.500">*/}
            {/*      Your primary Handles*/}
            {/*    </Text>*/}
            {/*    <Icon color="button.500" w={6} h={6} as={FlagIconFilled} />*/}
            {/*  </Box>*/}
            {/*)}*/}
            {isOwner && (
              <Button
                alignSelf={['inherit', 'flex-end']}
                variant="ghosted"
                color="grey.100"
                bgColor={isLowerThanMobile ? 'transparent' : undefined}
                fontWeight="normal"
                fontSize={['sm', 'sm']}
                h={9}
                rightIcon={<EditIcon w={5} h={5} />}
                onClick={action.onOpen}
              >
                Edit Profile
              </Button>
            )}
            <Button
              alignSelf={['inherit', 'flex-end']}
              variant="ghosted"
              color="grey.100"
              bgColor={isLowerThanMobile ? 'transparent' : undefined}
              fontWeight="normal"
              fontSize={['sm', 'sm']}
              h={9}
              rightIcon={<ExploreIcon />}
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_EXPLORER_URL}${domain}${ExplorerTypes.ASSETS}`,
                  '_blank'
                )
              }
            >
              Explorer
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/*{shortBio?.value && (*/}
      {/*  <Flex>*/}
      {/*    <Box>*/}
      {/*      <Text fontSize={['sm', 'sm']} fontWeight="400" color="grey.100">*/}
      {/*        {shortBio?.value}*/}
      {/*        /!* Robust security. Uncompromising performance. Built like no other,*/}
      {/*        Bako Safe is the next evolution in Multisig wallets. Stateless.*/}
      {/*        Future-proof. Our stateless design allows for the creation of*/}
      {/*        unlimited vaults at no cost (without sponsorships), and the very*/}
      {/*        low transaction fees of Fuel Network. *!/*/}
      {/*      </Text>*/}
      {/*    </Box>*/}
      {/*  </Flex>*/}
      {/*)}*/}
      {/*<EditProfileModal isOpen={action.isOpen} onClose={action.onClose} />*/}
    </Card>
  );
};
