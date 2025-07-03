import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Icon, VStack } from '@chakra-ui/react';

export const ListHeader = ({
  sortValue,
  sortDirection,
  onSortChange,
  label,
  sortKey,
}: {
  sortValue: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  label: string;
  sortKey: string;
}) => {
  return (
    <Box
      flex="1"
      cursor="pointer"
      onClick={() => onSortChange(sortKey)}
      display="flex"
      alignItems="center"
      color="white"
      fontWeight={600}
      fontSize="sm"
    >
      {label}

      <VStack spacing={0} gap={0} ml={1}>
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
