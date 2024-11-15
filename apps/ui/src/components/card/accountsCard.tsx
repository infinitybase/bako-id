import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Card } from '..';
import { VerifiedAccountInput } from '../inputs/verifiedAccount';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { useSidebar } from '../sidebar/hooks/useSidebar';
import { getMetadataRedirects } from '../../utils/metadatas';
import type { MetadataKeys } from '../../utils/metadataKeys';
import { Explorer } from '../helpers/explorer';
import { CopyText } from '../helpers/copy';

interface AccountsCardProps {
  metadata: { key: string; value: string | undefined }[] | undefined;
  addAction: () => void;
}

export const AccountsCard = ({ metadata, addAction }: AccountsCardProps) => {
  const { isMyDomain } = useSidebar();

  const getInputIcon = (key: MetadataKeys, value: string) => {
    const url = getMetadataRedirects(key, value);

    if (url) {
      return <Explorer redirectLink={url ?? ''} />;
    }

    return <CopyText value={value} />;
  };

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

      <VStack spacing={5}>
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
                rightAddonName={getInputIcon(
                  m.key as MetadataKeys,
                  m.value ?? '',
                )}
              />
            );
          })
        ) : (
          <Text color="grey.200" fontSize="xs" maxW="172px" h="26px" mt={20}>
            It seems like you haven’t added any account yet.
          </Text>
        )}
      </VStack>
    </Card>
  );
};
