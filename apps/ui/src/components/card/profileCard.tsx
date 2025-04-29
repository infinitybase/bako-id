import {
  Box,
  Button,
  type ButtonProps,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useClipboard,
  useMediaQuery,
} from '@chakra-ui/react';
import { Card } from '.';
import { ExplorerTypes } from '../../types';
import { getExplorer } from '../../utils/getExplorer';
import { MetadataKeys } from '../../utils/metadataKeys';
import { EditIcon, ExploreIcon, TwitterIcon } from '../icons';
import { useSidebar } from '../sidebar/hooks/useSidebar';
import { UserAvatar } from '../user/userAvatar.tsx';
import { useChainId } from '../../hooks/useChainId.ts';
import { useGetPrimaryHandleName } from '../../hooks/useGetPrimaryHandleName.ts';
import { FlagIconFilled } from '../icons/flagIconFilled.tsx';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { twitterLink } from '../../utils/formatter.ts';
import { ShareIcon } from '../icons/shareicon.tsx';

interface IProfileCard {
  domainName: string | null;
  domain: string;
  metadata: { key: string; value: string | undefined }[] | undefined;
  isMetadataLoading: boolean;
  editAction: () => void;
}

const ButtonAction = ({ rightIcon, ...props }: ButtonProps) => (
  <Button
    w="full"
    alignSelf={['inherit', 'flex-end']}
    variant="ghosted"
    color="grey.100"
    fontWeight="normal"
    fontSize={['sm', 'sm']}
    position="relative"
    justifyContent={{
      base: 'center',
      md: 'space-between',
    }}
    display="flex"
    {...props}
  >
    {props.children}
    {rightIcon}
  </Button>
);

export const ProfileCard = ({
  domain,
  domainName,
  metadata,
  editAction,
  isMetadataLoading,
}: IProfileCard) => {
  const [isLowerThanMobile] = useMediaQuery('(max-width: 25em)');
  const { isMyDomain: isOwner } = useSidebar();

  const nickname = metadata?.find(
    (m) => m.key === MetadataKeys.CONTACT_NICKNAME
  );
  const shortBio = metadata?.find((m) => m.key === MetadataKeys.CONTACT_BIO);
  const avatar = metadata?.find((m) => m.key === MetadataKeys.AVATAR);

  const { chainId } = useChainId();
  const explorerUrl = getExplorer(chainId);
  const { data: primaryHandle } = useGetPrimaryHandleName();
  const isPrimaryHandle = isOwner && primaryHandle === domainName;

  const {
    hasCopied,
    onCopy,
    value: profileLink,
  } = useClipboard(`https://bako.id/${domainName}`);

  const Actions = (
    <>
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
      {isPrimaryHandle && (
        <Text
          color="grey.100"
          fontSize="xs"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          bg="#FFC0100D"
          rounded="8px"
          p="6px 8px"
          w={['full', 'fit-content']}
          minW="170px"
          h="29px"
        >
          Your primary Handle
          <Icon color="button.500" w={6} h={6} as={FlagIconFilled} />
        </Text>
      )}
      {isOwner && (
        <ButtonAction
          rightIcon={<EditIcon w={4} h={4} />}
          onClick={editAction}
          p="6px 8px"
          gap={1}
          w={['full', 'fit-content']}
          h="29px"
          fontSize="xs"
        >
          Edit Profile
        </ButtonAction>
      )}
      <ButtonAction
        rightIcon={<ExploreIcon w={4} h={4} />}
        onClick={() =>
          window.open(`${explorerUrl}/account/${domain}${ExplorerTypes.ASSETS}`)
        }
        fontSize="xs"
        p="6px 8px"
        gap={1}
        w={['full', 'fit-content']}
        h="29px"
      >
        Explorer
      </ButtonAction>
      {isOwner && (
        <Menu variant="buttonDropdown" closeOnSelect={false}>
          <MenuButton
            as={Button}
            alignSelf={['inherit', 'flex-end']}
            variant="ghosted"
            color="grey.100"
            fontWeight="normal"
            fontSize={['sm', 'sm']}
            position="relative"
            flexDir="row"
            p="6px 8px"
            w={['full', 'fit-content']}
            h="29px"
          >
            <Flex
              alignItems="center"
              w="full"
              gap={1}
              fontSize="xs"
              justifyContent="center"
            >
              More
              <ShareIcon w={4} h={4} />
            </Flex>
          </MenuButton>
          <MenuList w={{ base: 'full', sm: 'auto' }}>
            <MenuItem
              onClick={() => {
                window.open(
                  twitterLink(profileLink, {
                    title: 'Check my Bako ID profile!',
                    related: [],
                  })
                );
              }}
              icon={<TwitterIcon w={15} h={15} />}
            >
              Share on X
            </MenuItem>
            <MenuItem
              onClick={onCopy}
              icon={
                hasCopied ? (
                  <CheckIcon w={15} h={15} />
                ) : (
                  <CopyIcon w={15} h={15} />
                )
              }
            >
              Copy profile link
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      {/*<Menu strategy="absolute">*/}
      {/*  <MenuButton*/}
      {/*    as={Button}*/}
      {/*    w="full"*/}
      {/*    alignSelf={['inherit', 'flex-end']}*/}
      {/*    variant="ghosted"*/}
      {/*    color="grey.100"*/}
      {/*    */}
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
    </>
  );

  return (
    <Card
      w="full"
      h="fit-content"
      alignItems="flex-start"
      backdropFilter="blur(7px)"
      justifyContent="space-between"
      gap={4}
      zIndex={1}
    >
      <Flex w="full">
        <UserAvatar
          avatar={avatar?.value}
          isAvatarLoading={isMetadataLoading}
        />

        <Flex
          gap={4}
          alignItems={isLowerThanMobile ? 'flex-start' : 'flex-start'}
          w="full"
          flexDir={isLowerThanMobile ? 'column' : 'row'}
          justifyContent="space-between"
        >
          <Flex flex={2} gap={2.5} direction="column" alignItems="flex-start">
            <Text fontWeight="semibold" fontSize={['md', 'lg']} color="white">
              {domainName?.startsWith('@') ? domainName : `@${domainName}`}
            </Text>

            {nickname?.value && (
              <Text
                fontSize={['sm', 'md']}
                color="grey.200"
                ml={0.5}
                maxW={{ base: '80%', sm: 'full' }}
              >
                {nickname.value}
              </Text>
            )}

            {/* <Flex gap={1} ml={0}>
              <FarcasterBadgeIcon w={8} h={8} />
              <DisabledXBadgeIcon w={8} h={8} />
            </Flex> */}
          </Flex>
          <Flex
            flex={1}
            display={{ base: 'none', sm: 'flex' }}
            w="full"
            flexDir="column"
            gap={2}
          >
            {Actions}
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
      <Flex
        flex={1}
        display={{ base: 'flex', sm: 'none' }}
        w="full"
        flexDir="column"
        gap={2}
      >
        {Actions}
      </Flex>
    </Card>
  );
};
