import { ExploreIcon } from '@/components/icons/explore';
import { ActionDomainModal } from '@/components/modal/actionDomainModal';
import { useChainId } from '@/hooks/useChainId';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import { ExplorerTypes, type RegistryContractToken } from '@/types';
import { getExplorer } from '@/utils/getExplorer';
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
import { TokenBody } from './tokenBody';

export const TokenCard = ({ token }: { token: RegistryContractToken }) => {
  const { domain, domainParam } = useProfile();
  const action = useDisclosure();
  const { chainId } = useChainId();

  const explorerUrl = getExplorer(chainId);

  return (
    <>
      <Card
        backdropFilter="blur(7px)"
        h="fit-content"
        maxW={['full', '45rem']}
        w={['full', 'auto', 'auto', '45rem']}
      >
        <CardHeader w="full">
          <Flex w="full" justify="space-between" align="center">
            <Heading fontSize="lg" color="grey.100">
              Token
            </Heading>
            <Button
              variant="ghosted"
              color="grey.100"
              rightIcon={<ExploreIcon w={5} h={5} />}
              // isDisabled={!isMyDomain}
              onClick={() =>
                window.open(
                  `${explorerUrl}/account/${domain?.Address?.bits ?? domain?.ContractId?.bits}${ExplorerTypes.ASSETS}`
                )
              }
            >
              Explorer
            </Button>
          </Flex>
        </CardHeader>
        <Divider color="stroke.500" border="1px solid" w="full" my={8} />
        <CardBody>
          <TokenBody
            onOpen={action.onOpen}
            contractId={token?.contractId ?? ''}
            subId={token?.subId}
          />
        </CardBody>
      </Card>
      <ActionDomainModal
        isOpen={action.isOpen}
        onClose={() => action.onClose()}
        action="Unwrap Handle"
        domain={`@${domainParam}`}
        modalTitle="Confirm details"
        modalSubtitle="Double check these details before confirming in your wallet."
        hasActions
        onConfirm={() => {}}
      />
    </>
  );
};
