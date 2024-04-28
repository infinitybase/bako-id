import type { Domain } from '@bako-id/sdk';
import { Button, Flex, Icon, Text, useMediaQuery } from '@chakra-ui/react';
import { Card } from '.';
import { DisabledXBadgeIcon } from '..';
import { AvatarIcon } from '../icons/avatarIcon';
import { ExploreIcon } from '../icons/explore';
import { FarcasterBadgeIcon } from '../icons/farcasterBadgeIcon';
import { useSidebar } from '../sidebar/hooks/useSidebar';

interface IProfileCard {
  domain: Domain | null;
}

export const ProfileCard = ({ domain }: IProfileCard) => {
  const [isLowerThanMobile] = useMediaQuery('(max-width: 25em)');
  const { isMyDomain } = useSidebar();
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
            @{domain?.name}
          </Text>

          <Flex gap={1}>
            <FarcasterBadgeIcon w={8} h={8} />
            <DisabledXBadgeIcon w={8} h={8} />
          </Flex>
        </Flex>
        <Button
          alignSelf={['inherit', 'flex-start']}
          variant="ghosted"
          color="grey.100"
          bgColor={isLowerThanMobile ? 'transparent' : undefined}
          fontWeight="normal"
          fontSize={['sm', 'md']}
          isDisabled={!isMyDomain}
          rightIcon={<ExploreIcon />}
          onClick={() =>
            window.open(
              `https://app.fuel.network/account/${domain?.owner}/assets`,
              '_blank',
            )
          }
        >
          Explorer
        </Button>
      </Flex>
    </Card>
  );
};
