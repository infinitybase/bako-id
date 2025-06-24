import {
  Button,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import { Card } from '..';

import { useWallet } from '@fuels/react';
import { Suspense } from 'react';
import { EditIcon, TextValue } from '../..';
import { useEditResolver } from '../../../hooks/useEditResolver';
import { useProfile } from '../../../modules/profile/hooks/useProfile';
import { EditResolverModal } from '../../modal/editResolver';
import { useSidebar } from '../../sidebar/hooks/useSidebar.tsx';

export const ResolverCard = () => {
  const { wallet } = useWallet();
  const action = useDisclosure();
  const { isMyDomain } = useSidebar();
  const { domain, domainParam } = useProfile();
  const {
    handleChangeResolver,
    mutationProgress,
    editResolver: { isPending },
  } = useEditResolver({
    domain: `${domainParam}`,
    account: wallet!,
  });

  // const { provider } = useProvider();
  // const explorerUrl = getExplorer(provider?.getChainId());

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
                hidden={!isMyDomain}
                // isDisabled
                onClick={action.onOpen}
              >
                Edit
              </Button>
            </Flex>
          </CardHeader>
          <CardBody mt={4}>
            <TextValue
              leftAction="address"
              content={domain ?? ''}
              // rightAction={
              //   <Explorer
              //     explorerUrl={`${explorerUrl}/account/`}
              //     id={domain?.Address?.bits ?? domain?.ContractId?.bits ?? ''}
              //     type={ExplorerTypes.ASSETS}
              //   />
              // }
              whiteSpace="nowrap"
              wordBreak="normal"
              isTruncated
            />
          </CardBody>
        </Card>
        <EditResolverModal
          progress={mutationProgress}
          isOpen={action.isOpen}
          onClose={() => action.onClose()}
          domain={`${domainParam}`}
          isLoading={isPending}
          resolver={domain ?? ''}
          onConfirm={(resolver) => handleChangeResolver(resolver)}
        />
      </Suspense>
    </>
  );
};
