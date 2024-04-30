import type { Domain } from '@bako-id/sdk';
import { Flex, Heading, Icon } from '@chakra-ui/react';
import { Address } from 'fuels';
import { Card, TextValue } from '..';
import { formatAddress } from '../../utils/formatter';
import { CopyText } from '../helpers/copy';
import { FuelIcon } from '../icons/fuelIcon';
import { LeftAddon } from '../inputs/leftAddon';
import { RightAddon } from '../inputs/rightAddon';

interface IAddressesCard {
  domain: Domain | null;
}

export const AddressesCard = ({ domain }: IAddressesCard) => {
  // const { isMyDomain } = useSidebar();

  if (!domain) return null;
  return (
    <Card
      w="full"
      h={['45%', '45%', 'full', 'auto']}
      p={6}
      display="flex"
      backdropFilter="blur(7px)"
      flexDirection="column"
      gap={6}
    >
      <Flex alignItems="center" justify="space-between">
        <Heading fontSize="lg">Addresses</Heading>
        {/* {isMyDomain && (
          <Button variant="ghosted" rightIcon={<PlusSquareIcon />}>
            Add
          </Button>
        )} */}
      </Flex>
      <Flex direction="column" alignItems="center" justifyContent="center">
        <TextValue
          leftAction={<LeftAddon value={<Icon as={FuelIcon} />} />}
          rightAction={
            <RightAddon
              value={
                <CopyText value={Address.fromB256(domain.owner).toString()} />
              }
            />
          }
          content={formatAddress(Address.fromB256(domain.owner).toString())}
        />
      </Flex>
    </Card>
  );
};
