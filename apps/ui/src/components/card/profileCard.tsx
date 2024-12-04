import { CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useClipboard,
  useMediaQuery,
} from '@chakra-ui/react';
import { useProvider } from '@fuels/react';
import { Card } from '.';
import { ExplorerTypes } from '../../types';
import { getExplorer } from '../../utils/getExplorer';
import { MetadataKeys } from '../../utils/metadataKeys';
import {
  AvatarIcon,
  // DisabledXBadgeIcon,
  EditIcon,
  ExploreIcon,
  // FarcasterBadgeIcon,
} from '../icons';
import { CopyIcon } from '../icons/copyIcon.tsx';
import { useSidebar } from '../sidebar/hooks/useSidebar';

interface IProfileCard {
  domainName: string | null;
  domain: string;
  metadata: { key: string; value: string | undefined }[] | undefined;
  editAction: () => void;
}

export const ProfileCard = ({
  domain,
  domainName,
  metadata,
  editAction,
}: IProfileCard) => {
  const [isLowerThanMobile] = useMediaQuery('(max-width: 25em)');
  const { isMyDomain: isOwner } = useSidebar();

  const nickname = metadata?.find(
    (m) => m.key === MetadataKeys.CONTACT_NICKNAME
  );
  const shortBio = metadata?.find((m) => m.key === MetadataKeys.CONTACT_BIO);
  const avatar = metadata?.find((m) => m.key === MetadataKeys.AVATAR);

  // const handle = handles?.find((handle) => handle.name === domainName);

  const { provider } = useProvider();

  const explorerUrl = getExplorer(provider?.getChainId());

  const { hasCopied, onCopy } = useClipboard(`https://bako.id/${domainName}`);

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
        {avatar ? (
          <Box
            w={32}
            h={28}
            rounded="lg"
            mr={4}
            bgImage={`url(${avatar.value})`}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            border="1.5px solid"
            borderColor={'button.500'}
          />
        ) : (
          <Icon w={32} h={32} rounded="lg" mr={4} as={AvatarIcon} />
        )}
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

            {nickname?.value && (
              <Text fontSize={['sm', 'md']} color="grey.200" ml={0.5}>
                {nickname.value}
              </Text>
            )}

            {/* <Flex gap={1} ml={0}>
              <FarcasterBadgeIcon w={8} h={8} />
              <DisabledXBadgeIcon w={8} h={8} />
            </Flex> */}
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
                w="full"
                alignSelf={['inherit', 'flex-end']}
                variant="ghosted"
                color="grey.100"
                bgColor={isLowerThanMobile ? 'transparent' : undefined}
                fontWeight="normal"
                fontSize={['sm', 'sm']}
                h={9}
                justifyContent="space-between"
                rightIcon={<EditIcon w={5} h={5} />}
                onClick={editAction}
              >
                Edit Profile
              </Button>
            )}
            <Button
              w="full"
              alignSelf={['inherit', 'flex-end']}
              variant="ghosted"
              color="grey.100"
              bgColor={isLowerThanMobile ? 'transparent' : undefined}
              fontWeight="normal"
              fontSize={['sm', 'sm']}
              h={9}
              justifyContent="space-between"
              rightIcon={<ExploreIcon w={5} h={5} />}
              onClick={() =>
                window.open(
                  `${explorerUrl}/account/${domain}${ExplorerTypes.ASSETS}`
                )
              }
            >
              Explorer
            </Button>
            <Button
              w="full"
              alignSelf={['inherit', 'flex-end']}
              variant="ghosted"
              color="grey.100"
              bgColor={isLowerThanMobile ? 'transparent' : undefined}
              fontWeight="normal"
              fontSize={['sm', 'sm']}
              rightIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
              h={9}
              justifyContent="space-between"
              onClick={onCopy}
            >
              Profile Link
            </Button>
            {/*<Menu strategy="absolute">*/}
            {/*  <MenuButton*/}
            {/*    as={Button}*/}
            {/*    w="full"*/}
            {/*    alignSelf={['inherit', 'flex-end']}*/}
            {/*    variant="ghosted"*/}
            {/*    color="grey.100"*/}
            {/*    bgColor={isLowerThanMobile ? 'transparent' : undefined}*/}
            {/*    fontWeight="normal"*/}
            {/*    fontSize={['sm', 'sm']}*/}
            {/*    h={9}*/}
            {/*    rightIcon={<ShareIcon />}*/}
            {/*  >*/}
            {/*    More*/}
            {/*  </MenuButton>*/}
            {/*  <MenuList zIndex={100}>*/}
            {/*    <MenuItem>Download</MenuItem>*/}
            {/*    <MenuItem>Create a Copy</MenuItem>*/}
            {/*    <MenuItem>Mark as Draft</MenuItem>*/}
            {/*    <MenuItem>Delete</MenuItem>*/}
            {/*    <MenuItem>Attend a Workshop</MenuItem>*/}
            {/*  </MenuList>*/}
            {/*</Menu>*/}
          </Flex>
        </Flex>
      </Flex>

      {shortBio?.value && (
        <Flex>
          <Box>
            <Text fontSize={['sm', 'sm']} fontWeight="400" color="grey.100">
              {shortBio?.value}
            </Text>
          </Box>
        </Flex>
      )}
    </Card>
  );
};
