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
import { TextValue } from '../..';
import { ExplorerTypes } from '../../../types';
import { Explorer } from '../../helpers/explorer';
import { EditIcon } from '../../icons/editIcon';
import { LeftAddon } from '../../inputs/leftAddon';
import { RightAddon } from '../../inputs/rightAddon';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const ResolverCard = () => {
  const action = useDisclosure();
  const { isMyDomain, domain } = useSidebar();

  if (!domain) return null;
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
          <TextValue
            leftAction={<LeftAddon value="address" />}
            content={Address.fromB256(domain.resolver).toString()}
            rightAction={
              <RightAddon
                value={
                  <Explorer id={domain.resolver} type={ExplorerTypes.ASSETS} />
                }
              />
            }
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
