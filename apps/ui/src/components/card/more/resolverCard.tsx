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
import { useProfile } from '../../../modules/profile/hooks/useProfile';
import { EditIcon } from '../../icons/editIcon';
import { ExploreIcon } from '../../icons/explore';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const ResolverCard = () => {
  const action = useDisclosure();
  const { isMyDomain } = useSidebar();
  const { domain, domainParam } = useProfile();

  return (
    <>
      <Card backdropFilter="blur(7px)" h="fit-content" minW="45%">
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
            value={domain ? Address.fromB256(domain).toString() : ''}
            rightAddon
            rightAddonName={<ExploreIcon />}
            rightAddonClick={() => {
              window.open(
                `https://app.fuel.network/account/${domain}/assets`,
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
        domain={`@${domainParam}`}
        modalTitle="Edit Resolver"
        hasActions
        onConfirm={() => {}}
      />
    </>
  );
};
