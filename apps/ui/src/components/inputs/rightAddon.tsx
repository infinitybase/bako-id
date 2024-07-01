import { InputRightAddon, type InputRightAddonProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface RightAddonProps extends InputRightAddonProps {
  value: string | ReactNode;
}

const RightAddon = ({ value, ...rest }: RightAddonProps) => {
  return (
    <InputRightAddon
      h={10}
      bgColor="input.600"
      borderColor="stroke.500"
      borderLeftColor="transparent"
      alignItems="center"
      justifyContent="center"
      fontSize="sm"
      w={'fit-content'}
      color={'section.500'}
      borderRightRadius="lg"
      pr={4}
      _hover={{
        cursor: 'pointer',
        color: 'button.500',
      }}
      {...rest}
    >
      {value}
    </InputRightAddon>
  );
};

export { RightAddon };
