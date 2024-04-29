import { Flex, Heading, Icon, VStack } from '@chakra-ui/react';
import { Card } from '..';
import { CopyIcon } from '../icons/copyIcon';
import { VerifiedAccountInput } from '../inputs/verifiedAccount';

export const AccountsCard = () => {
  // const { isMyDomain } = useSidebar();

  return (
    <Card
      w={['full', 'full', 'full', '50%']}
      h={['fit-content', 'fit-content', 'fit-content', 'auto']}
      display="flex"
      backdropFilter="blur(6px)"
      flexDirection="column"
      gap={6}
    >
      <Flex alignItems="center" justify="space-between">
        <Heading fontSize="lg">Accounts</Heading>
        {/* {isMyDomain && (
          <Button variant="ghosted" rightIcon={<PlusSquareIcon />}>
            Add
          </Button>
        )} */}
      </Flex>

      <VStack spacing={5}>
        <VerifiedAccountInput
          value={'@jonglazkov'}
          variant="farcaster"
          isVerified
          rightAddon
          rightAddonName={<Icon as={CopyIcon} />}
        />

        <VerifiedAccountInput
          variant="twitter"
          isVerified={false}
          rightAddon
          rightAddonName={<Icon as={CopyIcon} />}
        />
      </VStack>
    </Card>
  );
};
