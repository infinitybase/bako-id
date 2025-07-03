import { Box, Flex } from '@chakra-ui/react';
import SearchBar from './searchBar';
import CustomSelectFilter from './customSelectFilter';

interface MarketplaceFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  isCollectionPage?: boolean;
}

const MarketplaceFilter = ({
  searchValue,
  onSearchChange,
  onSortChange,
  isCollectionPage,
}: MarketplaceFilterProps) => (
  <Box p={2} borderRadius="md" w="100%" maxW="100vw" mx="auto" mt={2}>
    <Flex align="center" gap={4}>
      <Box flex="1">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder={
            isCollectionPage
              ? 'Search by asset id'
              : 'Search by collection name'
          }
        />
      </Box>
      <CustomSelectFilter onChange={onSortChange} />
    </Flex>
  </Box>
);

export default MarketplaceFilter;
