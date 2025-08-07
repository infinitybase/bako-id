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
  const isLastSold = label === 'Last sold';
  const displayTimeStamps = label === 'Sales' || label === 'Volume';

  return (
    <Box
      cursor={isLastSold ? 'auto' : 'pointer'}
      onClick={() => onSortChange(sortKey)}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      {...rest}
      position="relative"
      pointerEvents={isLastSold ? 'none' : 'auto'}
    >
      <Text color="white" fontWeight={600} fontSize="xs">
        {label}
      </Text>

      {displayTimeStamps && (
        <Text fontSize="xs" color="section.500" ml={2} fontWeight={300}>
          30d
        </Text>
      )}

      {!isLastSold && (
        <VStack spacing={0} gap={0} position="absolute" right={-6}>
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
      )}
    </Box>
  );
};
