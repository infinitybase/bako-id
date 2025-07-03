import {
  Button,
  Flex,
  Heading,
  Skeleton,
  useDisclosure,
} from '@chakra-ui/react';
import { useAccount } from '@fuels/react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Address } from 'fuels';
import { useMemo } from 'react';
import { Card, EditIcon, TextValue } from '..';
import { useGetGracePeriod } from '../../hooks/useGetGracePeriod';
import { OwnershipDialog } from '../../modules/profile/components/ownershipDialog.tsx';
import { ExplorerTypes } from '../../types';
import { formatAddress } from '../../utils/formatter';
import { CopyText } from '../helpers/copy';
import { Explorer } from '../helpers/explorer';

interface IOwnershipCard {
  owner: string | null;
  explorerUrl: string;
  domainName: string;
}
export const OwnershipCard = ({ owner, explorerUrl, domainName }: IOwnershipCard) => {
  const { domain } = useParams({ strict: false });
  const { dates, isLoading } = useGetGracePeriod(domain.replace('@', ''));
  const { account } = useAccount();
  const queryClient = useQueryClient();

  const dialog = useDisclosure({
    onClose() {
      queryClient.invalidateQueries({
        queryKey: ['resolveOwner', domain],
      });
    },
  });

  const isMyDomain = useMemo(() => {
    if (!owner || !account) return false;
    return (
      Address.fromString(account).toString() ===
      Address.fromString(owner).toString()
    );
  }, [account, owner]);

  return (
    <Card
      w="full"
      h={['fit-content', 'fit-content', 'fit-content', 'full']}
      p={6}
      display="flex"
      backdropFilter="blur(7px)"
      flexDirection="column"
      gap={6}
    >
      <Flex alignItems="center" justify="space-between">
        <Heading fontSize="lg">Ownership</Heading>
        {/* {isMyDomain && (
          <Button
            variant="ghosted"
            isDisabled={!isMyDomain}
            rightIcon={<DoubleArrowRightIcon />}
          >
            Extend
          </Button>
        )} */}
        {isMyDomain && (
          <Button
            variant="ghosted"
            onClick={dialog.onOpen}
            isDisabled={!isMyDomain}
            rightIcon={<EditIcon />}
          >
            Edit
          </Button>
        )}
        <OwnershipDialog
          doamin={domain}
          domainName={domainName ?? ''}
          isOpen={dialog.isOpen}
          onClose={dialog.onClose}
        />
      </Flex>
      <Flex
        direction="column"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={3}
      >
        <TextValue
          leftAction={'owner'}
          rightAction={
            <Explorer
              id={owner ?? ''}
              type={ExplorerTypes.ASSETS}
              explorerUrl={explorerUrl}
            />
          }
          content={owner ? formatAddress(Address.fromB256(owner).toB256()) : ''}
        />
        {/* <TextValue
          leftAction={'manager'}
          rightAction={
            <Explorer id={owner ?? ''} type={ExplorerTypes.ASSETS} />
          }
          content={manager}
        />
        <TextValue
          leftAction={'parent'}
          textAlign="right"
          rightAction={
            <CopyText value={format(data!.period, 'MMMM dd, yyyy')} />
          }
          content={parent}
        /> */}
        <Skeleton isLoaded={!isLoading} w="full" rounded="lg">
          <TextValue
            leftAction={'expiry'}
            textAlign="right"
            rightAction={
              <CopyText
                value={dates?.ttl ? format(dates.ttl, 'MMMM dd, yyyy') : ''}
              />
            }
            content={dates?.ttl ? format(dates.ttl, 'MMMM dd, yyyy') : ''}
          />
        </Skeleton>
      </Flex>
    </Card>
  );
};
