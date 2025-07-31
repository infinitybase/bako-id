import { ImageLoader } from '@/components/imageLoader';
import type { Collection } from '@/types/marketplace';
import { formatAddress, usdValueFormatter } from '@/utils/formatter';
import { Flex, Text, Grid, GridItem, Box } from '@chakra-ui/react';
import { useRouter } from '@tanstack/react-router';
import { isB256 } from 'fuels';
import { useScrollReset } from '@/hooks/useScrollReset';

const CollectionItem = ({ col }: { col: Collection }) => {
  const router = useRouter();
  const resetScroll = useScrollReset();

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        sm: '1fr 80px 120px 120px .5fr',
        md: '1fr 100px 150px 150px .5fr',
        lg: '492px 100px 200px 200px 1fr',
      }}
      gap={0}
      alignItems="center"
      px="6px"
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
      onClick={async () => {
        await router.navigate({
          to: '/collection/$collectionId',
          params: {
            collectionId: col.id,
          },
        });
        resetScroll();
      }}
    >
      <GridItem display="flex" gap={2} maxW="492px">
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

      <GridItem>
        <Text textAlign="right" justifyContent="flex-end" fontSize="xs">
          {col.metrics.sales}
        </Text>
      </GridItem>
      <GridItem>
        <Text textAlign="right" justifyContent="flex-end" fontSize="xs">
          {usdValueFormatter(col.metrics.volume ?? 0)}
        </Text>
      </GridItem>
      <GridItem>
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
      >
        {!col.latestSalesNFTs.length ? (
          <ImageLoader
            src={col.config.avatar}
            alt={'NFT Image'}
            imageProps={{
              boxSize: '40px',
              borderRadius: 'md',
            }}
          />
        ) : (
          col.latestSalesNFTs.map((item, index) => (
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
          ))
        )}
      </GridItem>
    </Grid>
  );
};

export { CollectionItem };
