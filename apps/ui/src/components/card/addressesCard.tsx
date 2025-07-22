import { useEditResolver } from '@/hooks/useEditResolver';
import { Button, Flex, Heading, Icon, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { Address } from 'fuels';
import { Card, EditIcon, TextValue } from '..';
import { formatAddress } from '../../utils/formatter';
import { CopyText } from '../helpers/copy';
import { FuelIcon } from '../icons/fuelIcon';
import { EditResolverModal } from '../modal/editResolver';
import { useSidebar } from '../sidebar/hooks/useSidebar';

interface IAddressesCard {
  resolver: string | null;
  explorerUrl?: string;
  domainParam: string;
}

export const AddressesCard = ({ resolver, domainParam }: IAddressesCard) => {
  const { isMyDomain } = useSidebar();
  const { wallet } = useWallet();
  const action = useDisclosure();

  const {
    handleChangeResolver,
    mutationProgress,
    editResolver: { isPending },
  } = useEditResolver({
    domain: domainParam,
    account: wallet!,
  });

  if (!resolver) return null;

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
        <Button
          variant="ghosted"
          onClick={action.onOpen}
          isDisabled={!isMyDomain}
          rightIcon={<EditIcon />}
        >
          Edit
        </Button>
      </Flex>
      <Flex direction="column" alignItems="center" justifyContent="center">
        <TextValue
          leftAction={<Icon as={FuelIcon} />}
          rightAction={<CopyText value={new Address(resolver).toString()} />}
          content={formatAddress(new Address(resolver).toString())}
        />
      </Flex>
      <EditResolverModal
        progress={mutationProgress}
        isOpen={action.isOpen}
        onClose={() => action.onClose()}
        domain={domainParam}
        isLoading={isPending}
        resolver={resolver ?? ''}
        onConfirm={(resolver) => handleChangeResolver(resolver)}
      />
    </Card>
  );
};
