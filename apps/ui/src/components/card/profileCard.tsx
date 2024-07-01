import {
  Button,
  Flex,
  Icon,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { Card } from '.';
import { DisabledXBadgeIcon, EditIcon } from '..';
import { ExplorerTypes } from '../../types';
import { AvatarIcon } from '../icons/avatarIcon';
import { ExploreIcon } from '../icons/explore';
import { FarcasterBadgeIcon } from '../icons/farcasterBadgeIcon';
import { EditProfileModal } from '../modal/editProfileModal';

interface IProfileCard {
  domainName: string | null;
  domain: string;
}

export const ProfileCard = ({ domain, domainName }: IProfileCard) => {
  const action = useDisclosure();
  const [isLowerThanMobile] = useMediaQuery('(max-width: 25em)');

  return (
    <Card
      w="full"
      h="fit-content"
      flexDirection="row"
      alignItems="center"
      backdropFilter="blur(7px)"
      justifyContent="space-between"
    >
      <Icon w={24} h={24} rounded="lg" mr={3} as={AvatarIcon} />
      <Flex
        gap={4}
        alignItems={isLowerThanMobile ? 'flex-start' : 'flex-start'}
        w="full"
        flexDir={isLowerThanMobile ? 'column' : 'row'}
        justifyContent="space-between"
      >
        <Flex gap={2} direction="column">
          <Text fontWeight="semibold" fontSize={['md', 'lg']} color="white">
            {domainName?.startsWith('@') ? domainName : `@${domainName}`}
          </Text>

          <Flex gap={1}>
            <FarcasterBadgeIcon w={8} h={8} />
            <DisabledXBadgeIcon w={8} h={8} />
          </Flex>
        </Flex>
        <Flex flexDir="column" gap={3}>
          <Button
            alignSelf={['inherit', 'flex-start']}
            variant="ghosted"
            color="grey.100"
            bgColor={isLowerThanMobile ? 'transparent' : undefined}
            fontWeight="normal"
            fontSize={['sm', 'md']}
            rightIcon={<EditIcon w={5} h={5} />}
            onClick={action.onOpen}
          >
            Edit Profile
          </Button>
          <Button
            alignSelf={['inherit', 'flex-start']}
            variant="ghosted"
            color="grey.100"
            bgColor={isLowerThanMobile ? 'transparent' : undefined}
            fontWeight="normal"
            fontSize={['sm', 'md']}
            rightIcon={<ExploreIcon />}
            onClick={() =>
              window.open(
                `${import.meta.env.VITE_EXPLORER_URL}${domain}${ExplorerTypes.ASSETS}`,
                '_blank',
              )
            }
          >
            Explorer
          </Button>
        </Flex>
      </Flex>
      <EditProfileModal isOpen={action.isOpen} onClose={action.onClose} />
    </Card>
  );
};
