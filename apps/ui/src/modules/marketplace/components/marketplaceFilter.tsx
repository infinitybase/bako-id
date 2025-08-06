import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
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
}: MarketplaceFilterProps) => {
  const [isSmallMobile] = useMediaQuery(
    '(min-width: 320px) and (max-width: 420px)'
  );

  return (
    <Box p={2} px={0} borderRadius="md" w="100%" maxW="100vw" mx="auto" mt={2}>
      <Flex align="center" gap={4} flexDir={isSmallMobile ? 'column' : 'row'}>
        <Box flex="1" w={isSmallMobile ? 'full' : 'auto'}>
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={
              isCollectionPage ? 'Search by asset id' : 'Search collection'
            }
          />
        </Box>

        <CustomSelectFilter
          onChange={onSortChange}
          props={{
            display: {
              base: 'block',
              sm: !isCollectionPage ? 'none' : 'block',
            },
            pr: {
              base: isSmallMobile ? '10px' : !isCollectionPage ? '10px' : '0',
              sm: '0',
            },
            maxW: isSmallMobile ? 'full' : '192px',
          }}
        />
      </Flex>
    </Box>
  );
};

export default MarketplaceFilter;
