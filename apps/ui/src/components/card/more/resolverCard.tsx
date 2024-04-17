import {
  Button,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import { Card } from '..';
import { TextInput } from '../..';
import { EditIcon } from '../../icons/editIcon';
import { ExploreIcon } from '../../icons/explore';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';
import { useCustomToast } from '../../toast';

export const ResolverCard = () => {
  const action = useDisclosure();
  const { isMyDomain, domain } = useSidebar();
  const { successToast } = useCustomToast();

  const copy = () => {
    navigator.clipboard.writeText(domain?.resolver ?? '').then(() => {
      successToast({ title: 'Address copied to clipboard' });
    });
  };

  return (
    <>
      <Card h="fit-content" minW="full">
        <CardHeader w="full">
          <Flex w="full" justify="space-between" align="center">
            <Heading fontSize="lg">Resolver</Heading>
            <Button
              variant="ghost"
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
        <Divider color="stroke.500" border="1px solid" w="full" my={8} />
        <CardBody>
          <TextInput
            leftAddon
            leftAddonName="address"
            value={domain?.resolver}
            rightAddon
            rightAddonName={<ExploreIcon />}
            rightAddonClick={copy}
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
