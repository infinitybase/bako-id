import { Button, Divider, Flex } from '@chakra-ui/react';

import { BakoTooltip, CheckoutCard, TextValue } from '../..';

import { CopyText } from '../../helpers/copy';

interface TokenCardProps {
  contractId: string;
  subId: string;
  onOpen: () => void;
}

const TokenBody = ({ contractId, onOpen, subId }: TokenCardProps) => {
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
            content={contractId}
            rightAction={<CopyText value={contractId ?? ''} />}
          />

          <TextValue
            breakRow
            justifyContent="start"
            leftAction={'decimal'}
            content={subId}
            rightAction={<CopyText value={subId ?? ''} />}
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
            onClick={onOpen}
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

export { TokenBody };
