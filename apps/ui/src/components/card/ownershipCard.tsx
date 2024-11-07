import { Flex, Heading } from '@chakra-ui/react';
import { Address } from 'fuels';
import { Card, TextValue } from '..';
import { ExplorerTypes } from '../../types';
import { formatAddress } from '../../utils/formatter';
import { Explorer } from '../helpers/explorer';
import { CopyText } from '../helpers/copy';
import { format } from 'date-fns';
import { useParams } from '@tanstack/react-router';
import { useGetGracePeriod } from '../../hooks/useGetGracePeriod';

interface IOwnershipCard {
  owner: string | null;
}
export const OwnershipCard = ({ owner }: IOwnershipCard) => {
  const { domain } = useParams({ strict: false });
  const { data } = useGetGracePeriod(domain.replace('@', ''));

  if (!data) return null;

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
            <Explorer id={owner ?? ''} type={ExplorerTypes.ASSETS} />
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
        <TextValue
          leftAction={'expiry'}
          textAlign="right"
          rightAction={
            <CopyText value={format(data!.period, 'MMMM dd, yyyy')} />
          }
          content={format(data!.period, 'MMMM dd, yyyy')}
        />
      </Flex>
    </Card>
  );
};
