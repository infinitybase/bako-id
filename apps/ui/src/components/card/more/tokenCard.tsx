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
import { useScreenSize } from '../../../hooks/useScreenSize';
import { CopyText } from '../../helpers/copy';
import { ExploreIcon } from '../../icons/explore';
import { LeftAddon } from '../../inputs/leftAddon';
import { RightAddon } from '../../inputs/rightAddon';
import { ActionDomainModal } from '../../modal/actionDomainModal';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const TokenCard = () => {
  const { isMyDomain, domain } = useSidebar();
  const { isMobile } = useScreenSize();

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
                justifyContent="start"
                h={16}
                whiteSpace={!isMobile ? 'pre-wrap' : 'nowrap'}
                wordBreak={!isMobile ? 'break-word' : 'normal'}
                isTruncated={isMobile ? true : false}
                leftAction={<LeftAddon w={20} h={16} value="hex" />}
                content="0x769jepagpoa8egn3543v53545b354f354q5g54q533354"
                rightAction={
                  <RightAddon
                    h={16}
                    value={
                      <CopyText value="0x769jepagpoa8egn3543v53545b354f354q5g54q533354" />
                    }
                  />
                }
              />

              <TextValue
                justifyContent="start"
                h={16}
                leftAction={<LeftAddon w={20} h={16} value="decimal" />}
                content="0x769jepagpoa8egn3543v53545b354f354q5g54q533354"
                rightAction={
                  <RightAddon
                    h={16}
                    value={
                      <CopyText value="0x769jepagpoa8egn3543v53545b354f354q5g54q533354" />
                    }
                  />
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
              w={['full', '70%']}
              leftAction={<LeftAddon value="wrapper" />}
              content="wrapped, emancipated"
              rightAction={
                <RightAddon value={<CopyText value="wrapped, emancipated" />} />
              }
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
