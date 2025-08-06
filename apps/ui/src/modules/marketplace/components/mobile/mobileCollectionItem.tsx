import { ImageLoader } from '@/components/imageLoader';
import type { Collection } from '@/types/marketplace';
import { formatAddress, usdValueFormatter } from '@/utils/formatter';
import { Flex, Text, Grid, GridItem, Box } from '@chakra-ui/react';
import { useRouter } from '@tanstack/react-router';
import { isB256 } from 'fuels';
import { useScrollReset } from '@/hooks/useScrollReset';

const MobileCollectionItem = ({ col }: { col: Collection }) => {
  const router = useRouter();
  const resetScroll = useScrollReset();

  return (
    <Box
      borderRadius="8px 0 0 8px"
      bg="grey.600"
      mt={2}
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
      <Flex h="56px">
        {/* Fixed first column */}
        <Box
          w={{
            base: '200px',
            sm: '250px',
          }}
          px="6px"
          py="8px"
          display="flex"
          gap={2}
          alignItems="center"
          borderRadius="8px 0 0 8px"
          bg="grey.600"
          border="1px solid"
          borderColor="grey.600"
          transition="all 0.2s ease-in-out"
          zIndex={2}
        >
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
          <Flex direction="column" align="start" flex={1}>
            <Text color="white" fontSize="xs" minW="120px">
              {isB256(col.name) ? formatAddress(col.name) : col.name}
            </Text>
            <Text
              fontSize="xs"
              color="section.500"
              fontWeight={300}
              textOverflow="ellipsis"
              noOfLines={1}
              maxW="320px"
            >
              {col.config.description}
            </Text>
          </Flex>
        </Box>

        {/* Scrollable columns */}
        <Box
          overflowX="auto"
          flex={1}
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Grid
            templateColumns={{
              base: '50px 120px 120px 100px',
              sm: '50px 100px 100px 100px',
            }}
            gap={0}
            alignItems="center"
            minW="fit-content"
            h="100%"
          >
            <GridItem px="6px" py="8px">
              <Text textAlign="right" justifyContent="flex-end" fontSize="xs">
                {col.metrics.sales}
              </Text>
            </GridItem>
            <GridItem px="6px" py="8px">
              <Text textAlign="right" justifyContent="flex-end" fontSize="xs">
                {usdValueFormatter(col.metrics.volume ?? 0)}
              </Text>
            </GridItem>
            <GridItem px="6px" py="8px">
              <Text textAlign="right" justifyContent="flex-end" fontSize="xs">
                {usdValueFormatter(col?.metrics?.floorPrice ?? 0)}
              </Text>
            </GridItem>
            <GridItem
              gap="6px"
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              px="6px"
              py="8px"
              minW="120px"
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
        </Box>
      </Flex>
    </Box>
  );
};

export { MobileCollectionItem };
