import type { Domain } from '@bako-id/sdk';
import { Flex, Heading, Icon } from '@chakra-ui/react';
import { Card, TextInput } from '..';
import { formatAddress } from '../../utils/formatter';
import { CopyIcon } from '../icons/copyIcon';
import { FuelIcon } from '../icons/fuelIcon';

interface IAddressesCard {
  domain: Domain | null;
}

export const AddressesCard = ({ domain }: IAddressesCard) => {
  // const { isMyDomain } = useSidebar();

  const copy = () => {
    navigator.clipboard.writeText(domain!.owner.toString());
  };

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
        <TextInput
          leftAddon
          leftAddonName={<Icon as={FuelIcon} />}
          rightAddon
          textAlign="right"
          rightAddonName={<Icon as={CopyIcon} />}
          rightAddonClick={copy}
          value={formatAddress(domain?.owner ?? '')}
        />
      </Flex>
    </Card>
  );
};
