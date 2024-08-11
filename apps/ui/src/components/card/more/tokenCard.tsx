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
import { BakoTooltip, CheckoutCard, TextValue } from '../..';
import { useToken } from '../../../hooks/useToken';
import { useProfile } from '../../../modules/profile/hooks/useProfile';
import { CopyText } from '../../helpers/copy';
import { ExploreIcon } from '../../icons/explore';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const TokenCard = () => {
  const { token } = useToken();
  const { isMyDomain } = useSidebar();
  const { domain, domainParam } = useProfile();
  const action = useDisclosure();

  const TokenBody = () => {
    return (
      <>
        <Flex
          direction={['column', 'row', 'row', 'row']}
          alignItems="center"
          h="fit-content"
          justifyContent="flex-end"
          gap={4}
          w="full"
        >
          <Flex w={['full', '80%']} direction="column" gap={6}>
            <TextValue
              breakRow
              justifyContent="start"
              leftAction={'hex'}
              content={token?.contractId}
              rightAction={<CopyText value={token?.contractId ?? ''} />}
            />

            <TextValue
              breakRow
              justifyContent="start"
              leftAction={'decimal'}
              content={token?.subId}
              rightAction={<CopyText value={token?.subId ?? ''} />}
            />
          </Flex>

          <CheckoutCard w={['fit-content', '40', '40', '40']} />
        </Flex>
        <Divider color="stroke.500" border="1px solid" w="full" my={[3, 8]} />
        <Flex w="full" justify="center" direction={['column', 'row']} gap={4}>
          <TextValue
            justifyContent="start"
            leftAction={'wrapper'}
            content="wrapped, emancipated"
            rightAction={<CopyText value="wrapped, emancipated" />}
          />
          <BakoTooltip>
            <Button
              isDisabled
              onClick={action.onOpen}
              fontSize="md"
              w={['full', '31%']}
              variant="primary"
              _hover={{}}
            >
              Unwrap
            </Button>
          </BakoTooltip>
        </Flex>
      </>
    );
  };

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
                window.open(`https://app.fuel.network/account/${domain}/assets`)
              }
            >
              Explorer
            </Button>
          </Flex>
        </CardHeader>
        <Divider color="stroke.500" border="1px solid" w="full" my={8} />
        <CardBody>
          <TokenBody />
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
