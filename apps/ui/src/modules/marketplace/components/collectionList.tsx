import type { Collection } from '@/types/marketplace';
import { ListHeader } from './listHeader';
import { CollectionItem } from './collectionItem';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';

type SortDirection = 'asc' | 'desc';

type CollectionListProps = {
  collections: Collection[];
  sortValue: string;
  sortDirection: SortDirection;
  onSortChange: (column: string) => void;
  isLoading: boolean;
};

const listHeaderItems = [
  {
    label: 'Sales',
    sortKey: 'metrics.sales',
  },
  {
    label: 'Volume',
    sortKey: 'metrics.volume',
  },
  {
    label: 'Floor price',
    sortKey: 'metrics.floorPrice',
  },
  {
    label: 'Last sold',
    sortKey: 'lastSold',
  },
];

export const CollectionList = ({
  collections,
  sortValue,
  sortDirection,
  onSortChange,
  isLoading,
}: CollectionListProps) => {
  const isEmptyCollections = !collections?.length;

  return (
    <Box>
      {isEmptyCollections && !isLoading && (
        <VStack>
          <Heading size="md" textAlign="center">
            No collections available
          </Heading>
        </VStack>
      )}

      {!isEmptyCollections && (
        <Flex py={2} fontWeight="bold" color="gray.400" mb={6}>
          <Text color="white" flex="2" fontWeight={600} fontSize="sm">
            Collection name
          </Text>
          {listHeaderItems.map((item) => (
            <ListHeader
              key={item.sortKey}
              sortValue={sortValue}
              sortDirection={sortDirection}
              onSortChange={onSortChange}
              label={item.label}
              sortKey={item.sortKey}
              maxW={item.sortKey === 'lastSold' ? '200px' : '140px'}
              mr={2}
            />
          ))}
        </Flex>
      )}

      {collections.map((col) => (
        <CollectionItem key={col.id} col={col} />
      ))}
    </Box>
  );
};
