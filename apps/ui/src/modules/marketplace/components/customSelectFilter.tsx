import {
  Box,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const options = [
  { value: 'created_at', label: 'Recently listed' },
  { value: 'price.usd-asc', label: 'Price Low to High' },
  { value: 'price.usd-desc', label: 'Price High to Low' },
];

interface CustomSelectFilterProps {
  onChange: (value: string) => void;
}

export default function CustomSelectFilter({
  onChange,
}: CustomSelectFilterProps) {
  const [selectedValue, setSelectedValue] = useState('');
  const selected = options.find((opt) => opt.value === selectedValue);

  return (
    <Box position="relative" maxW="192px" w="100%">
      <Text
        position="absolute"
        left="16px"
        top="2px"
        color="grey.200"
        fontSize="sm"
        pointerEvents="none"
        zIndex="1"
      >
        Sort by
      </Text>
      <Menu>
        <MenuButton
          as={Flex}
          w="100%"
          h="48px"
          bg="input.600"
          border="1px solid"
          borderColor="grey.600"
          borderRadius="md"
          cursor="pointer"
          position="relative"
          alignItems="center"
          pl="16px"
          _hover={{ bg: 'grey.600' }}
        >
          <Text
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            flex="1"
            fontSize="14px"
            mt="14px"
          >
            {selected?.label || 'Select...'}
          </Text>
          <Icon
            as={ChevronDownIcon}
            position="absolute"
            right="16px"
            top="50%"
            transform="translateY(-50%)"
            boxSize={6}
          />
        </MenuButton>
        <MenuList bg="input.600" borderColor="grey.600" minW="192px">
          {options.map((opt) => (
            <MenuItem
              key={opt.value}
              onClick={() => {
                setSelectedValue(opt.value);
                onChange(opt.value);
              }}
              bg="input.600"
              color="white"
              _hover={{ bg: 'grey.600' }}
            >
              {opt.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}
