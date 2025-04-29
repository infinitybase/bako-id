import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Card, ImportDataIcon } from '..';
import { MetadataKeys } from '../../utils/metadataKeys';
import { getMetadataRedirects } from '../../utils/metadatas';
import { CopyText } from '../helpers/copy';
import { Explorer } from '../helpers/explorer';
import { VerifiedAccountInput } from '../inputs/verifiedAccount';
import { useSidebar } from '../sidebar/hooks/useSidebar';
import { NSDialog } from '../../modules/ens/components/dialog';

interface AccountsCardProps {
  metadata: { key: string; value: string | undefined }[] | undefined;
  addAction: () => void;
  isMetadataLoading: boolean;
}

const EmptyAccounts = ({ ensAction }: { ensAction: () => void }) => {
  const { isMyDomain } = useSidebar();

  return (
    <VStack w="full" h={'full'} justify={'center'} py={6} spacing={4}>
      <Text color="grey.200" fontSize="xs" maxW="172px" textAlign={'center'}>
        {isMyDomain
          ? 'It seems like you haven’t added any account yet.'
          : 'It seems like this user hasn’t added any account yet'}
      </Text>

      {isMyDomain && (
        <Button
          h={'28px'}
          color="grey.100"
          fontSize={'xs'}
          variant="ghosted"
          bg={'white.100'}
          rightIcon={<ImportDataIcon fontSize={18} />}
          onClick={ensAction}
        >
          Import data from ENS
        </Button>
      )}
    </VStack>
  );
};

export const AccountsCard = ({
  metadata,
  addAction,
  isMetadataLoading,
}: AccountsCardProps) => {
  const { isMyDomain } = useSidebar();
  const ensDialogState = useDisclosure();

  const getInputIcon = (key: MetadataKeys, value: string) => {
    const url = getMetadataRedirects(key, value);

    if (url) {
      return <Explorer redirectLink={url ?? ''} />;
    }

    return <CopyText value={value} />;
  };

  const avoidKeys = [
    MetadataKeys.CONTACT_BIO,
    MetadataKeys.CONTACT_NICKNAME,
    MetadataKeys.AVATAR,
  ];

  return (
    <>
      <NSDialog
        isOpen={ensDialogState.isOpen}
        onClose={ensDialogState.onClose}
      />

      <Card
        w={['full', 'full', 'full', '50%']}
        h={['fit-content', 'fit-content', 'fit-content', 'auto']}
        display="flex"
        backdropFilter="blur(6px)"
        flexDirection="column"
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

        {metadata?.filter(
          (data) => !avoidKeys.includes(data.key as MetadataKeys)
        ).length ? (
          <VStack spacing={5} h="full" mt={6}>
            {metadata?.map((m) => {
              const variant = { key: m.key as MetadataKeys, value: m.value };

              return (
                <VerifiedAccountInput
                  key={m.key}
                  value={m.value}
                  variant={variant}
                  isMetadataLoading={isMetadataLoading}
                  isVerified
                  rightAddon
                  rightAddonName={getInputIcon(
                    m.key as MetadataKeys,
                    m.value ?? ''
                  )}
                />
              );
            })}
          </VStack>
        ) : (
          <EmptyAccounts ensAction={ensDialogState.onOpen} />
        )}
      </Card>
    </>
  );
};
