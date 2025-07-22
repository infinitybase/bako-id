import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, type BoxProps, Icon, Text, VStack } from '@chakra-ui/react';

type ListHeaderProps = {
  sortValue: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  label: string;
  sortKey: string;
} & BoxProps;

export const ListHeader = ({
  sortValue,
  sortDirection,
  onSortChange,
  label,
  sortKey,
  ...rest
}: ListHeaderProps) => {
  return (
    <Box
      flex="1"
      cursor="pointer"
      onClick={() => onSortChange(sortKey)}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      color="white"
      fontWeight={600}
      fontSize="xs"
      {...rest}
    >
      {label}

      <Text fontSize="xs" color="section.500" mx={2} fontWeight={300}>
        24h
      </Text>

      <VStack spacing={0} gap={0}>
        <Icon
          as={ChevronUpIcon}
          color={
            sortValue === sortKey && sortDirection === 'asc'
              ? 'section.500'
              : 'white'
          }
          w={4}
          h={4}
        />

        <Icon
          as={ChevronDownIcon}
          color={
            sortValue === sortKey && sortDirection === 'desc'
              ? 'section.500'
              : 'white'
          }
          w={4}
          h={4}
        />
      </VStack>
    </Box>
  );
};
