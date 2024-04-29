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
import { CheckoutCard, TextInput } from '../..';
import { CopyIcon } from '../../icons/copyIcon';
import { ExploreIcon } from '../../icons/explore';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const TokenCard = () => {
  const { isMyDomain, domain } = useSidebar();
  const action = useDisclosure();

  return (
    <>
      <Card backdropFilter="blur(7px)" h="fit-content" minW="45%">
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
            gap={6}
          >
            <Flex w="full" h="full" direction="column" gap={5}>
              <TextInput
                inputHeight={16}
                leftAddon
                leftAddonName="hex"
                value="0x769jepagpoa8egn3543v53545b354f354q5g54q533354"
                rightAddon
                rightAddonWidth="5%"
                rightAddonName={<CopyIcon />}
                rightAddonClick={() => {}}
              />

              <TextInput
                inputHeight={16}
                leftAddon
                leftAddonName="decimal"
                value="0x769jepagpoa8egn3543v53545b354f354q5g54q533354"
                rightAddon
                rightAddonWidth="5%"
                rightAddonName={<CopyIcon />}
                rightAddonClick={() => {}}
              />
            </Flex>

            <CheckoutCard
              w={['fit-content', '25%', '25%', '25%']}
              domain={domain?.name ?? ''}
            />
          </Flex>
          <Divider color="stroke.500" border="1px solid" w="full" my={[3, 8]} />
          <Flex w="full" justify="center" direction={['column', 'row']} gap={4}>
            <TextInput
              w={['full', '72%']}
              leftAddon
              leftAddonName="wrapper"
              value="wrapped, emancipated"
              rightAddon
              rightAddonWidth="5%"
              rightAddonName={<CopyIcon />}
              rightAddonClick={() => {}}
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
