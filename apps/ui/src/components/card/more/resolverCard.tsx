import {
  Button,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import { Card } from '..';

import { useProvider, useWallet } from '@fuels/react';
import { Suspense } from 'react';
import { BakoTooltip, TextValue } from '../..';
import { useEditResolver } from '../../../hooks/useEditResolver';
import { useProfile } from '../../../modules/profile/hooks/useProfile';
import { ExplorerTypes } from '../../../types';
import { Explorer } from '../../helpers/explorer';
import { EditIcon } from '../../icons/editIcon';
import { EditResolverModal } from '../../modal/editResolver';
import { getExplorer } from '../../../utils/getExplorer';
// import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const ResolverCard = () => {
  const { wallet } = useWallet();
  const action = useDisclosure();
  // const { isMyDomain } = useSidebar();
  const { domain, domainParam } = useProfile();
  const { handleChangeResolver } = useEditResolver({
    domain: `${domainParam}`,
    account: wallet!,
  });

  const { provider } = useProvider();
  const explorerUrl = getExplorer(provider?.getChainId());

  return (
    <>
      <Suspense>
        <Card
          backdropFilter="blur(7px)"
          h="fit-content"
          maxW={['full', '45rem']}
        >
          <CardHeader w="full">
            <Flex w="full" justify="space-between" align="center">
              <Heading fontSize="lg" color="grey.100">
                Resolver
              </Heading>
              <BakoTooltip>
                <Button
                  variant="ghost"
                  mr={1}
                  px={0}
                  color="grey.100"
                  _hover={{
                    bgColor: 'transparent',
                    // color: 'button.500',
                    color: 'grey.100"',
                  }}
                  rightIcon={<EditIcon w={5} h={5} />}
                  // isDisabled={!isMyDomain}
                  isDisabled
                  onClick={action.onOpen}
                >
                  Edit
                </Button>
              </BakoTooltip>
            </Flex>
          </CardHeader>
          <CardBody mt={4}>
            <TextValue
              leftAction="address"
              content={domain?.Address?.bits ?? domain?.ContractId?.bits ?? ''}
              rightAction={
                <Explorer
                  explorerUrl={`${explorerUrl}/account/`}
                  id={domain?.Address?.bits ?? domain?.ContractId?.bits ?? ''}
                  type={ExplorerTypes.ASSETS}
                />
              }
              whiteSpace="nowrap"
              wordBreak="normal"
              isTruncated
            />
          </CardBody>
        </Card>
        <EditResolverModal
          isOpen={action.isOpen}
          onClose={() => action.onClose()}
          domain={`${domainParam}`}
          resolver={domain?.Address?.bits ?? domain?.ContractId?.bits ?? ''}
          onConfirm={(resolver) => handleChangeResolver(resolver)}
        />
      </Suspense>
    </>
  );
};
