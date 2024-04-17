import { Domain } from '@bako-id/sdk';
import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import { Card } from '.';
import { useScreenSize } from '../../hooks/useScreenSize';
import { XBadgeIcon } from '../icons/TwitterBadgeIcon';
import { AvatarIcon } from '../icons/avatarIcon';
import { ExploreIcon } from '../icons/explore';
import { FarcasterBadgeIcon } from '../icons/farcasterBadgeIcon';
import { useSidebar } from '../sidebar/hooks/useSidebar';

interface IProfileCard {
  domain: Domain | null;
}

export const ProfileCard = ({ domain }: IProfileCard) => {
  const { isMobile } = useScreenSize();
  const { isMyDomain } = useSidebar();
  return (
    <Card
      w="full"
      h={['fit-content', 'fit-content', 'fit-content', '20%']}
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Flex gap={4}>
        <Icon w={24} h={24} rounded="lg" as={AvatarIcon} />

        <Flex gap={2} direction="column">
          <Text fontWeight="semibold" fontSize="lg" color="white">
            @{domain?.name}
          </Text>

          <Flex gap={1}>
            <FarcasterBadgeIcon w={8} h={8} />
            <XBadgeIcon w={8} h={8} />
          </Flex>
        </Flex>
      </Flex>
      <Button
        alignSelf={isMobile ? 'flex-end' : 'flex-start'}
        variant="ghosted"
        isDisabled={!isMyDomain}
        rightIcon={<ExploreIcon />}
        onClick={() =>
          window.open(
            `https://app.fuel.network/account/${domain?.owner}/assets`,
          )
        }
      >
        Explorer
      </Button>
    </Card>
  );
};
