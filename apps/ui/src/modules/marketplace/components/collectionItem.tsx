import { ImageLoader } from '@/components/imageLoader';
import type { Collection } from '@/types/marketplace';
import { formatAddress, usdValueFormatter } from '@/utils/formatter';
import { Flex, Text, Grid } from '@chakra-ui/react';
import { useRouter } from '@tanstack/react-router';
import { isB256 } from 'fuels';

const CollectionItem = ({ col }: { col: Collection }) => {
  const router = useRouter();
  return (
    <Grid
      templateColumns="2fr 140px 140px 140px 140px"
      gap={2}
      mr={3}
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
      <Flex align="center" gap={3}>
        <ImageLoader
          src={col?.config?.avatar}
          alt={'NFT Image'}
          imageProps={{
            boxSize: '40px',
            borderRadius: 'md',
          }}
        />
        <Text>{isB256(col.name) ? formatAddress(col.name) : col.name}</Text>
      </Flex>
      <Text
        textAlign="right"
        maxW="140px"
        justifyContent="flex-end"
        fontSize="xs"
      >
        {usdValueFormatter(col.metrics.volume ?? 0)}
      </Text>
      <Text
        textAlign="right"
        maxW="140px"
        justifyContent="flex-end"
        fontSize="xs"
      >
        {usdValueFormatter(col?.metrics?.floorPrice ?? 0)}
      </Text>
      <Text
        textAlign="right"
        maxW="140px"
        justifyContent="flex-end"
        fontSize="xs"
      >
        {col.metrics.sales}
      </Text>
      <Flex gap={2} justifyContent="flex-end" ml="auto" maxW="140px">
        {col.latestSalesNFTs.map((item) => (
          <ImageLoader
            key={item.id}
            src={item.image}
            alt={'NFT Image'}
            imageProps={{
              boxSize: '40px',
              borderRadius: 'md',
            }}
          />
        ))}
      </Flex>
    </Grid>
  );
};

export { CollectionItem };
