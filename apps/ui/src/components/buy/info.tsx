import { Divider, Flex, Text, VStack } from '@chakra-ui/react';
import { NumericInput, TextInput } from '../inputs';
import { formatCoin } from '../../utils/formatter.ts';
import { calculateDomainPrice } from '../../utils/calculator.ts';
import { DeleteIcon } from '@chakra-ui/icons';
import { Coin } from '../../types';

const { ETH } = Coin;

interface InfoProps {
  name: string;
  index: number;
  periodHandle: (index: number, newValue: number) => void;
}

const Info = ({ name, index, periodHandle }: InfoProps) => {
  return (
    <VStack w="full" key={name} spacing={5}>
      {index > 0 && <Divider w="80%" borderColor="link.500" />}
      <VStack w="full" spacing={0}>
        <TextInput value={`@${name}`} />
        <Flex
          w="full"
          border="none"
          backgroundColor="input.500"
          padding=".5rem .75rem"
          marginTop=".5rem"
          borderRadius={8}
          justifyContent="space-around"
          alignItems="center"
        >
          <NumericInput index={index} onChange={periodHandle} key={0} />
          <Flex gap={3} alignItems="center" w="80%" justifyContent="flex-end">
            <Text color="white" fontSize="sm">
              {formatCoin(calculateDomainPrice(name, 1), ETH)}
            </Text>
            <DeleteIcon
              cursor={'pointer'}
              color="error.500"
              // onClick={() => {
              //   index === 0 && items.length === 1
              //     ? backHome()
              //     : handleDelete(name);
              // }}
            />
          </Flex>
        </Flex>
      </VStack>
    </VStack>
  );
};

export { Info };
