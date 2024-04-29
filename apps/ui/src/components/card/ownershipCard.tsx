import type { Domain } from '@bako-id/sdk';
import { CopyIcon } from '@chakra-ui/icons';
import { Flex, Heading, Icon } from '@chakra-ui/react';
import { Address } from 'fuels';
import { Card, TextInput } from '..';
import { formatAddress } from '../../utils/formatter';
import { ExploreIcon } from '../icons/explore';

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
        <TextInput
          textAlign="right"
          leftAddon
          leftAddonName="owner"
          rightAddon
          rightAddonName={<Icon as={ExploreIcon} />}
          rightAddonClick={() =>
            window.open(
              `https://app.fuel.network/account/${domain?.owner}/assets`
            )
          }
          value={
            domain?.owner
              ? formatAddress(Address.fromB256(domain.owner).toString())
              : ''
          }
        />
        <TextInput
          leftAddon
          leftAddonName="expiry"
          textAlign="right"
          rightAddon
          rightAddonName={<Icon as={CopyIcon} />}
          value="march 31, 2024"
        />
      </Flex>
    </Card>
  );
};
