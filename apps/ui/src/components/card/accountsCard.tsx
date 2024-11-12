import { Button, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { Card } from '..';
import { CopyIcon } from '../icons/copyIcon';
import { VerifiedAccountInput } from '../inputs/verifiedAccount';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { useSidebar } from '../sidebar/hooks/useSidebar';

interface AccountsCardProps {
  metadata: { key: string; value: string | undefined }[] | undefined;
  addAction: () => void;
}

export const AccountsCard = ({ metadata, addAction }: AccountsCardProps) => {
  const { isMyDomain } = useSidebar();

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
        {isMyDomain && (
          <Button
            variant="ghosted"
            rightIcon={<PlusSquareIcon />}
            onClick={addAction}
          >
            Add
          </Button>
        )}
      </Flex>

      <VStack
        spacing={5}
        h={metadata?.length ? 'unset' : 'full'}
        alignItems={metadata?.length ? 'unset' : 'center'}
        justifyContent={metadata?.length ? 'unset' : 'center'}
      >
        {metadata?.length ? (
          metadata?.map((m) => {
            const keyAfterColon = m.key.split(':')[1];
            const variant = { key: keyAfterColon, value: m.value };

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
          })
        ) : (
          <Text fontSize="xs" lineHeight="16.8px" color="grey.200">
            It seems like you haven’t added any account yet.
          </Text>
        )}
      </VStack>
    </Card>
  );
};
