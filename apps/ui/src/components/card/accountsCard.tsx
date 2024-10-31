import type { Metadata } from '@bako-id/sdk';
import { Flex, Heading, Icon, VStack } from '@chakra-ui/react';
import { Card } from '..';
import { CopyIcon } from '../icons/copyIcon';
import { VerifiedAccountInput } from '../inputs/verifiedAccount';

interface AccountsCardProps {
  metadata: Metadata[] | undefined;
}

export const AccountsCard = ({ metadata }: AccountsCardProps) => {
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
        {metadata?.map((m) => {
          const keyAfterColon = m.key.split(':')[1];

          const variant = {
            key: keyAfterColon,
            value: m.value,
          };

          return (
            <VerifiedAccountInput
              key={m.key}
              value={m.value}
              variant={variant}
              isVerified
              rightAddon
              rightAddonName={<Icon as={CopyIcon} />}
            />
          );
        })}
        {/* <VerifiedAccountInput
          variant="twitter"
          isVerified={false}
          rightAddon
          rightAddonName={<Icon as={CopyIcon} />}
        /> */}
      </VStack>
    </Card>
  );
};
