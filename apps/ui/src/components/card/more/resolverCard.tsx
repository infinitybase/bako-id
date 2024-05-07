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
import { useProfile } from '../../../modules/profile/hooks/useProfile';
import { ExplorerTypes } from '../../../types';
import { Explorer } from '../../helpers/explorer';
import { EditIcon } from '../../icons/editIcon';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const ResolverCard = () => {
  const action = useDisclosure();
  const { isMyDomain } = useSidebar();
  const { domain, domainParam } = useProfile();

  if (!domain) return null;
  return (
    <>
      <Card backdropFilter="blur(7px)" h="fit-content" maxW={['full', '45rem']}>
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
            leftAction="address"
            content={Address.fromB256(domain).toString()}
            rightAction={<Explorer id={domain} type={ExplorerTypes.ASSETS} />}
            whiteSpace="nowrap"
            wordBreak="normal"
            isTruncated
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
