import { Box, Button, Input } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';

interface NumericInputProps {
  index: number;
  onChange: (index: number, newValue: number) => void;
}

export const NumericInput = ({ index, onChange }: NumericInputProps) => {
  const [period, setPeriod] = useState(1);

  const debouncedOnChange = useCallback(debounce(onChange, 500), []);

  const decrement = () => {
    const newValue = Math.max(period - 1, 1);
    setPeriod((prev) => prev - 1);
    debouncedOnChange(index, newValue);
  };

  const increment = () => {
    const newValue = period + 1;
    setPeriod((prev) => prev + 1);
    debouncedOnChange(index, newValue);
  };

  return (
    <Box
      display="flex"
      w="55%"
      h={10}
      backgroundColor="background.900"
      justifyContent="space-around"
      borderRadius="lg"
      border="1px solid"
      borderColor="stroke.500"
      alignItems="center"
    >
      <Button
        color="section.200"
        backgroundColor="transparent"
        fontSize={24}
        h={9}
        isDisabled={period <= 1}
        onClick={decrement}
        _active={{ backgroundColor: 'inherit' }}
        _focus={{
          backgroundColor: 'inherit',
          boxShadow: 'none',
          outline: 'none',
        }}
        _hover={{ color: period <= 1 ? undefined : 'button.500' }}
      >
        -
      </Button>
      <Input
        color="section.200"
        value={`${period} years`}
        type="text"
        h={19}
        fontSize="sm"
        textAlign="center"
        border="none"
        p={0}
      />
      <Button
        color="section.200"
        backgroundColor="transparent"
        fontSize={24}
        h={9}
        onClick={increment}
        _active={{ bgColor: 'inherit' }}
        _focus={{ bgColor: 'inherit' }}
        _hover={{ color: 'button.500' }}
        // isDisabled={value >= 3}
        // isDisabled={true}
      >
        +
      </Button>
    </Box>
  );
};
