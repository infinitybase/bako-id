import { ImageLoader } from '@/components/imageLoader';
import type { Collection } from '@/types/marketplace';
import { formatAddress, usdValueFormatter } from '@/utils/formatter';
import { Flex, Text, Grid, GridItem, Box } from '@chakra-ui/react';
import { useRouter } from '@tanstack/react-router';
import { isB256 } from 'fuels';

const CollectionItem = ({ col }: { col: Collection }) => {
  const router = useRouter();

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        sm: '1fr 80px 120px 120px 120px',
        md: '1fr 100px 150px 150px 150px',
        lg: '492px 100px 200px 200px 200px',
      }}
      gap={0}
      alignItems="center"
      px={2}
      borderRadius="md"
      bg="grey.600"
      mb={2}
      h="56px"
      border="1px solid"
      borderColor="grey.600"
      transition="all 0.2s ease-in-out"
      _hover={{
        bg: 'grey.500',
      }}
      cursor="pointer"
      onClick={() => {
        router.navigate({
          to: '/collection/$collectionId',
          params: {
            collectionId: col.id,
          },
        });
      }}
    >
      <GridItem display="flex" gap={2} maxW={{ base: '100%', lg: '492px' }}>
        <Box minW="40px">
          <ImageLoader
            src={col?.config?.avatar}
            alt={'NFT Image'}
            imageProps={{
              boxSize: '40px',
              borderRadius: 'md',
            }}
          />
        </Box>
        <Flex align="center">
          <Text color="white" fontSize="xs" minW="120px">
            {isB256(col.name) ? formatAddress(col.name) : col.name}
          </Text>
          <Text
            fontSize="xs"
            color="section.500"
            fontWeight={300}
            textOverflow="ellipsis"
            noOfLines={2}
            maxW="320px"
          >
            {col.config.description}
          </Text>
        </Flex>
      </GridItem>

      <GridItem maxW={{ base: '100%', sm: '80px', md: '100px', lg: '100px' }}>
        <Text textAlign="right" justifyContent="flex-end" fontSize="xs">
          {col.metrics.sales}
        </Text>
      </GridItem>
      <GridItem maxW={{ base: '100%', sm: '120px', md: '150px', lg: '200px' }}>
        <Text textAlign="right" justifyContent="flex-end" fontSize="xs">
          {usdValueFormatter(col.metrics.volume ?? 0)}
        </Text>
      </GridItem>
      <GridItem maxW={{ base: '100%', sm: '120px', md: '150px', lg: '200px' }}>
        <Text textAlign="right" justifyContent="flex-end" fontSize="xs">
          {usdValueFormatter(col?.metrics?.floorPrice ?? 0)}
        </Text>
      </GridItem>
      <GridItem
        gap="6px"
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        ml="30px"
        minW={{ base: '100%', sm: '120px', md: '150px', lg: '240px' }}
      >
        {col.latestSalesNFTs.map((item, index) => (
          <Box
            key={item.id}
            display={{
              base: index === 0 ? 'block' : 'none',
              sm: index < 2 ? 'block' : 'none',
              md: index < 3 ? 'block' : 'none',
              lg: 'block',
            }}
          >
            <ImageLoader
              src={item.image}
              alt={'NFT Image'}
              imageProps={{
                boxSize: '40px',
                borderRadius: 'md',
              }}
            />
          </Box>
        ))}
      </GridItem>
    </Grid>
  );
};

export { CollectionItem };
