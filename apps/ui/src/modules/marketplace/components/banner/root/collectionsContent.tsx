import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { parseURI, usdValueFormatter } from '@/utils/formatter';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { StatBox } from './statBox';
import type { Collection } from '@/types/marketplace';
import { useGetMintData } from '@/hooks/marketplace/useGetMintData';

const CollectionsContent = ({
  collection,
  handleRedirect,
}: { collection: Collection; handleRedirect: () => void }) => {
  const { totalMinted, maxSupply } = useGetMintData(
    collection.id,
    collection.isMintable
  );

  const isMintable = totalMinted < maxSupply;

  return (
    <Box
      position="relative"
      w="full"
      h="full"
      cursor="pointer"
      onClick={handleRedirect}
      aspectRatio={{
        base: '16/9',
        md: '16/9',
        lg: '8/3',
      }}
      _before={{
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url('${parseURI(collection.config.banner)}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Gradient */}
      <Box
        position="absolute"
        left={0}
        bottom={0}
        width="100%"
        height="40%"
        bgGradient="linear(0deg, rgba(21,20,19,0.85) 0%, rgba(21,20,19,0.00) 100%)"
        zIndex={2}
        pointerEvents="none"
      />
      <Flex
        position="relative"
        zIndex={3}
        h="full"
        align="center"
        justify="space-between"
        mx="auto"
        alignItems="flex-end"
        maxW="1280px"
      >
        <Box color="#fff" maxW="lg" mt="auto" mb={4}>
          <VStack align="flex-start" mb={4}>
            {isMintable && (
              <Text
                bg="#B3FF2E1A"
                borderRadius="100px"
                py={1}
                px={4}
                backdropBlur="blur(24px)"
                color="garage.100"
                letterSpacing="0.05em"
                fontSize="10px"
                border="1px solid #B3FF2E40"
                boxShadow="0px 6px 12px 0px #00000040"
                bgGradient="linear(to-r, #00000040, #00000040)"
                mb={1}
              >
                Now Minting
              </Text>
            )}

            <Heading fontSize="md" fontWeight={600}>
              {collection.name}
            </Heading>
          </VStack>
          <Flex gap={3}>
            <StatBox label="Sales" value={collection.metrics.sales} />
            <StatBox
              label="Floor price"
              value={usdValueFormatter(Number(collection.metrics.floorPrice))}
            />
            <StatBox
              label="Volume"
              value={usdValueFormatter(collection.metrics.volume)}
            />
          </Flex>
        </Box>
        <Button
          rightIcon={<ArrowForwardIcon />}
          color="#222"
          bg="#fff"
          borderRadius="8px"
          fontWeight={500}
          fontSize="16px"
          px={6}
          py={2}
          _hover={{ bg: 'gray.100' }}
          zIndex={3}
          mb={4}
        >
          Explore collection
        </Button>
      </Flex>
    </Box>
  );
};

export { CollectionsContent };
