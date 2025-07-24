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
  const displayTimeStamps =
    label !== 'Floor price' && label !== 'Last sold' && label !== '24h';

  return (
    <Box
      flex="1"
      cursor="pointer"
      onClick={() => onSortChange(sortKey)}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      {...rest}
    >
      <Text color="white" fontWeight={600} fontSize="xs">
        {label}
      </Text>

      {displayTimeStamps && (
        <Text fontSize="xs" color="section.500" mx={2} fontWeight={300}>
          30d
        </Text>
      )}

      <VStack spacing={0} gap={0} ml={displayTimeStamps ? 0 : 2}>
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
