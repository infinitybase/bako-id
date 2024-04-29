import {
  Button,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import { Address } from 'fuels';
import { Card } from '..';
import { TextInput } from '../..';
import { EditIcon } from '../../icons/editIcon';
import { ExploreIcon } from '../../icons/explore';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const ResolverCard = () => {
  const action = useDisclosure();
  const { isMyDomain, domain } = useSidebar();

  return (
    <>
      <Card backdropFilter="blur(7px)" h="fit-content" maxW={['full', '90%']}>
        <CardHeader w="full">
          <Flex w="full" justify="space-between" align="center">
            <Heading fontSize="lg" color="grey.100">
              Resolver
            </Heading>
            <Button
              variant="ghost"
              mr={1}
              color="grey.100"
              _hover={{
                bgColor: 'transparent',
                color: 'button.500',
              }}
              rightIcon={<EditIcon w={5} h={5} />}
              isDisabled={!isMyDomain}
              onClick={action.onOpen}
            >
              Edit
            </Button>
          </Flex>
        </CardHeader>
        <CardBody mt={4}>
          <TextInput
            leftAddon
            leftAddonName="address"
            value={
              domain?.resolver
                ? Address.fromB256(domain.resolver).toString()
                : ''
            }
            rightAddon
            rightAddonName={<ExploreIcon />}
            rightAddonClick={() => {
              window.open(
                `https://app.fuel.network/account/${domain?.resolver}/assets`,
                '_blank',
              );
            }}
          />
        </CardBody>
      </Card>
      <ActionDomainModal
        isOpen={action.isOpen}
        onClose={() => action.onClose()}
        action="Edit handle"
        domain={`@${domain?.name}`}
        modalTitle="Edit Resolver"
        hasActions
        onConfirm={() => {}}
      />
    </>
  );
};
