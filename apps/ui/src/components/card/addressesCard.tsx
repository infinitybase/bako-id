import { Domain } from '@bako-id/sdk';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading, Icon } from '@chakra-ui/react';
import { Card, TextInput } from '..';
import { EthereumIcon } from '../icons/ethereumIcon';
import { ExploreIcon } from '../icons/explore';
import { useSidebar } from '../sidebar/hooks/useSidebar';

interface IAddressesCard {
  domain: Domain | null;
}

export const AddressesCard = ({ domain }: IAddressesCard) => {
  const { isMyDomain } = useSidebar();
  const copy = () => {
    navigator.clipboard.writeText(domain!.owner.toString());
  };
  return (
    <Card
      w="full"
      h={['45%', '45%', 'full', '35%']}
      p={6}
      display="flex"
      flexDirection="column"
      gap={6}
    >
      <Flex alignItems="center" justify="space-between">
        <Heading fontSize="lg">Addresses</Heading>
        {isMyDomain && (
          <Button variant="ghosted" rightIcon={<PlusSquareIcon />}>
            Add
          </Button>
        )}
      </Flex>
      <Flex direction="column" alignItems="center" justifyContent="center">
        <TextInput
          leftAddon
          leftAddonName={<Icon w={4} h={4} as={EthereumIcon} />}
          rightAddon
          rightAddonName={<Icon as={ExploreIcon} />}
          rightAddonClick={copy}
          value={domain?.owner}
        />
      </Flex>
    </Card>
  );
};
