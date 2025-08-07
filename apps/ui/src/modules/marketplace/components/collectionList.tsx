import type { Collection } from '@/types/marketplace';
import { ListHeader } from './listHeader';
import { CollectionItem } from './collectionItem';
import { Box, Grid, GridItem, Heading, Text, VStack } from '@chakra-ui/react';

type SortDirection = 'asc' | 'desc';

type CollectionListProps = {
  collections: Collection[];
  sortValue: SortableColumns;
  sortDirection: SortDirection;
  onSortChange: (column: SortableColumns) => void;
  isLoading: boolean;
};

export enum SortableColumns {
  SALES = 'metrics.sales',
  VOLUME = 'metrics.volume',
  FLOOR_PRICE = 'metrics.floorPrice',
  LAST_SOLD = 'lastSold',
}

const listHeaderItems = [
  {
    label: 'Sales',
    sortKey: SortableColumns.SALES,
  },
  {
    label: 'Volume',
    sortKey: SortableColumns.VOLUME,
  },
  {
    label: 'Floor price',
    sortKey: SortableColumns.FLOOR_PRICE,
  },
  {
    label: 'Last sold',
    sortKey: SortableColumns.LAST_SOLD,
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
        <Grid
          templateColumns={{
            base: '1fr',
            sm: '1fr 80px 120px 120px .5fr',
            md: '1fr 100px 150px 150px .5fr',
            lg: '492px 100px 200px 200px 1fr',
          }}
          gap={0}
          alignItems="center"
          px={2}
          py={2}
          fontWeight="bold"
          color="gray.400"
          mb={6}
        >
          <GridItem>
            <Text color="white" fontWeight={600} fontSize="sm">
              Collection name
            </Text>
          </GridItem>
          {listHeaderItems.map((item) => (
            <GridItem key={item.sortKey} w="full">
              <ListHeader
                sortValue={sortValue}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
                label={item.label}
                sortKey={item.sortKey}
                w="fit-content"
                ml="auto"
              />
            </GridItem>
          ))}
        </Grid>
      )}

      {collections.map((col) => (
        <CollectionItem key={col.id} col={col} />
      ))}
    </Box>
  );
};
