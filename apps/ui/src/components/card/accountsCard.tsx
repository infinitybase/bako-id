import { CopyIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading, Icon, VStack } from '@chakra-ui/react';
import { Card, FarcasterIcon, TwitterIcon } from '..';
import { VerifiedAccountInput } from '../inputs/verifiedAccount';
import { useSidebar } from '../sidebar/hooks/useSidebar';

export const AccountsCard = () => {
  const { isMyDomain } = useSidebar();
  return (
    <Card
      w={['full', 'full', 'full', '40%']}
      h={['fit-content', 'fit-content', 'fit-content', 'full']}
      display="flex"
      flexDirection="column"
      gap={6}
    >
      <Flex alignItems="center" justify="space-between">
        <Heading fontSize="lg">Accounts</Heading>
        {isMyDomain && (
          <Button variant="ghosted" rightIcon={<PlusSquareIcon />}>
            Add
          </Button>
        )}
      </Flex>

      <VStack>
        <VerifiedAccountInput
          value={'@xoncraskov'}
          accountIcon={FarcasterIcon}
          isVerified
          rightAddon
          iconColor="white"
          iconBgColor="#7F5FC7"
          rightAddonClick={() => {}}
          rightAddonName={<Icon as={CopyIcon} />}
        />

        <VerifiedAccountInput
          value={'@jonglazkov'}
          accountIcon={TwitterIcon}
          isVerified={false}
          rightAddon
          iconColor="white"
          iconBgColor="black"
          rightAddonClick={() => {}}
          rightAddonName={<Icon as={CopyIcon} />}
        />
      </VStack>
    </Card>
  );
};
