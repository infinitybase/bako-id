import type { Collection } from '@/types/marketplace';
import { ListHeader } from './listHeader';
import { CollectionItem } from './collectionItem';
import { Box, Grid, GridItem, Heading, Text, VStack } from '@chakra-ui/react';

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
        <Grid
          templateColumns={{
            base: '1fr',
            sm: '1fr 80px 120px 120px 1fr',
            md: '1fr 100px 150px 150px 1fr',
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
            <GridItem key={item.sortKey}>
              <ListHeader
                sortValue={sortValue}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
                label={item.label}
                sortKey={item.sortKey}
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
