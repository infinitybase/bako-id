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
import { CheckoutCard, TextValue } from '../..';
import { CopyText } from '../../helpers/copy';
import { ExploreIcon } from '../../icons/explore';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const TokenCard = () => {
  const { isMyDomain, domain } = useSidebar();
  const action = useDisclosure();

  return (
    <>
      <Card backdropFilter="blur(7px)" h="fit-content" maxW={['full', '90%']}>
        <CardHeader w="full">
          <Flex w="full" justify="space-between" align="center">
            <Heading fontSize="lg" color="grey.100">
              Token
            </Heading>
            <Button
              variant="ghosted"
              color="grey.100"
              rightIcon={<ExploreIcon w={5} h={5} />}
              isDisabled={!isMyDomain}
              onClick={() =>
                window.open(
                  `https://app.fuel.network/account/${domain?.owner}/assets`,
                )
              }
            >
              Explorer
            </Button>
          </Flex>
        </CardHeader>
        <Divider color="stroke.500" border="1px solid" w="full" my={8} />
        <CardBody>
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
                content="0x769jepagpoa8egn3543v53545b354f354q5g54q533354"
                rightAction={
                  <CopyText value="0x769jepagpoa8egn3543v53545b354f354q5g54q533354" />
                }
              />

              <TextValue
                breakRow
                justifyContent="start"
                leftAction={'decimal'}
                content="0x769jepagpoa8egn3543v53545b354f354q5g54q533354"
                rightAction={
                  <CopyText value="0x769jepagpoa8egn3543v53545b354f354q5g54q533354" />
                }
              />
            </Flex>

            <CheckoutCard
              w={['fit-content', '40', '40', '40']}
              domain={domain?.name ?? ''}
            />
          </Flex>
          <Divider color="stroke.500" border="1px solid" w="full" my={[3, 8]} />
          <Flex w="full" justify="center" direction={['column', 'row']} gap={4}>
            <TextValue
              justifyContent="start"
              leftAction={'wrapper'}
              content="wrapped, emancipated"
              rightAction={<CopyText value="wrapped, emancipated" />}
            />
            <Button
              isDisabled={!isMyDomain}
              onClick={action.onOpen}
              fontSize="md"
              w={['full', '31%']}
              variant="primary"
            >
              Unwrap
            </Button>
          </Flex>
        </CardBody>
      </Card>
      <ActionDomainModal
        isOpen={action.isOpen}
        onClose={() => action.onClose()}
        action="Unwrap Handle"
        domain={`@${domain?.name}`}
        modalTitle="Confirm details"
        modalSubtitle="Double check these details before confirming in your wallet."
        hasActions
        onConfirm={() => {}}
      />
    </>
  );
};
