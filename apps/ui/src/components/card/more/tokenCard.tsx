import { CopyIcon } from '@chakra-ui/icons';
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
import { ExploreIcon } from '../../icons/explore';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const TokenCard = () => {
  const { isMyDomain, domain } = useSidebar();
  const action = useDisclosure();

  return (
    <>
      <Card h="fit-content" minW="45%">
        <CardHeader w="full">
          <Flex w="full" justify="space-between" align="center">
            <Heading fontSize="lg">Token</Heading>
            <Button
              variant="ghosted"
              rightIcon={<ExploreIcon />}
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
            justifyContent="flex-end"
            gap={4}
          >
            <Flex w={['full', '80%']} direction="column" gap={6}>
              <TextInput
                inputHeight={16}
                leftAddon
                leftAddonName="hex"
                value="0x769jepagpoa8egn3543v53545b354f354q5g54q533354"
                rightAddon
                rightAddonName={<CopyIcon />}
                rightAddonClick={() => {}}
              />

              <TextInput
                inputHeight={16}
                leftAddon
                leftAddonName="decimal"
                value="0x769jepagpoa8egn3543v53545b354f354q5g54q533354"
                rightAddon
                rightAddonName={<CopyIcon />}
                rightAddonClick={() => {}}
              />
            </Flex>

            <CheckoutCard
              w={['full', '25%', '30%', '25%']}
              domain={domain?.name ?? ''}
            />
          </Flex>
          <Divider color="stroke.500" border="1px solid" w="full" my={[3, 8]} />
          <Flex justify="center" direction={['column', 'row']} gap={4}>
            <TextInput
              w={['full', '80%']}
              leftAddon
              leftAddonName="wrapper"
              value="wrapped, emancipated"
              rightAddon
              rightAddonName={<CopyIcon />}
              rightAddonClick={() => {}}
            />
            <Button
              isDisabled={!isMyDomain}
              onClick={action.onOpen}
              w={['full', '30%']}
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
