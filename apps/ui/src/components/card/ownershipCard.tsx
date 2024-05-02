import type { Domain } from '@bako-id/sdk';
import { Flex, Heading } from '@chakra-ui/react';
import { Address } from 'fuels';
import { Card, TextValue } from '..';
import { ExplorerTypes } from '../../types';
import { formatAddress } from '../../utils/formatter';
import { CopyText } from '../helpers/copy';
import { Explorer } from '../helpers/explorer';

interface IOwnershipCard {
  domain: Domain | null;
}
export const OwnershipCard = ({ domain }: IOwnershipCard) => {
  // const { isMyDomain } = useSidebar();
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
            <Explorer id={domain?.owner ?? ''} type={ExplorerTypes.ASSETS} />
          }
          content={
            domain?.owner
              ? formatAddress(Address.fromB256(domain.owner).toString())
              : ''
          }
        />
        <TextValue
          leftAction={'expiry'}
          textAlign="right"
          rightAction={<CopyText value={'march 31, 2024'} />}
          content="march 31, 2024"
        />
      </Flex>
    </Card>
  );
};
