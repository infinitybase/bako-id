import { Divider, HStack } from '@chakra-ui/react';
import { TextValue } from '..';

interface InfoProps {
  name: string;
  index: number;
  periodHandle?: (index: number, newValue: number) => void;
}

const Info = ({ name, index }: InfoProps) => {
  return (
    <HStack w="full" key={name} spacing={5}>
      {index > 0 && <Divider w="80%" borderColor="link.500" />}
      <HStack w="full" spacing={2}>
        <TextValue justifyContent="start" darkBg content={`@${name}`} />

        {/* <NumericInput index={index} onChange={periodHandle} key={0} /> */}
      </HStack>
    </HStack>
  );
};

export { Info };
