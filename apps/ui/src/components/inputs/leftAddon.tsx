import { InputLeftAddon, type InputLeftAddonProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface LeftAddonProps extends InputLeftAddonProps {
  value: string | ReactNode;
}

const LeftAddon = ({ value, ...rest }: LeftAddonProps) => {
  return (
    <InputLeftAddon
      h={10}
      bgColor="input.600"
      borderColor="stroke.500"
      borderRight="none"
      alignItems="center"
      justifyContent="flex-start"
      fontSize={['xs', 'sm']}
      pl={2.5}
      w={'min-content'}
      color={'section.500'}
      borderLeftRadius="lg"
      {...rest}
    >
      {value}
    </InputLeftAddon>
  );
};

export { LeftAddon };
