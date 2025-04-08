import { CheckIcon } from '@chakra-ui/icons';
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
import { useProvider } from '@fuels/react';
import { Card } from '.';
import { ExplorerTypes } from '../../types';
import { twitterLink } from '../../utils/formatter.ts';
import { getExplorer } from '../../utils/getExplorer';
import { MetadataKeys } from '../../utils/metadataKeys';
import {
  AvatarIcon,
  // DisabledXBadgeIcon,
  EditIcon,
  ExploreIcon,
  TwitterIcon,
  // FarcasterBadgeIcon,
} from '../icons';
import { CopyIcon } from '../icons/copyIcon.tsx';
import { ShareIcon } from '../icons/shareicon.tsx';
import { useSidebar } from '../sidebar/hooks/useSidebar';

interface IProfileCard {
  domainName: string | null;
  domain: string;
  metadata: { key: string; value: string | undefined }[] | undefined;
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
      {isOwner && (
        <ButtonAction rightIcon={<EditIcon w={5} h={5} />} onClick={editAction}>
          <Box mr={2} flex={1}>
            Edit Profile
          </Box>
        </ButtonAction>
      )}
      <ButtonAction
        rightIcon={<ExploreIcon w={5} h={5} />}
        onClick={() =>
          window.open(`${explorerUrl}/account/${domain}${ExplorerTypes.ASSETS}`)
        }
      >
        <Box mr={2} flex={1}>
          Explorer
        </Box>
      </ButtonAction>
      {isOwner && (
        <Menu variant="buttonDropdown" closeOnSelect={false}>
          <MenuButton
            as={Button}
            w="full"
            alignSelf={['inherit', 'flex-end']}
            variant="ghosted"
            color="grey.100"
            fontWeight="normal"
            fontSize={['sm', 'sm']}
            position="relative"
            flexDir="row"
          >
            <Flex alignItems="center" w="full">
              <Box mr={2} flex={1}>
                More
              </Box>
              <ShareIcon />
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
        {avatar ? (
          <Box
            minW={32}
            h={32}
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
          <Flex flex={2} gap={2.5} direction="column" alignItems="flex-start">
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
