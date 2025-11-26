import { useGetMintData } from '@/hooks/marketplace/useGetMintData';
import type { Collection } from '@/types/marketplace';
import { parseURI, usdValueFormatter } from '@/utils/formatter';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { StatBox } from './statBox';

type CollectionsContentProps = {
  collection: Collection;
  handleRedirect: () => void;
};

const CollectionsContent = ({
  collection,
  handleRedirect,
}: CollectionsContentProps) => {
  const { maxSupply, totalMinted, isPaused } = useGetMintData(
    collection.id,
    collection.isMintable ?? false,
  );

  const isMintable = Number(totalMinted) < Number(maxSupply) && !isPaused;

  return (
    <Box
      position="relative"
      w="full"
      h="full"
      cursor="pointer"
      onClick={handleRedirect}
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
        borderRadius: { base: '8px', sm: 'none' },
      }}
    >
      {/* Gradient */}
      <Box
        position="absolute"
        left={0}
        bottom={0}
        width="100%"
        height="full"
        bgGradient="linear-gradient(0deg, rgba(21, 20, 19, 0.85) 0%, rgba(21, 20, 19, 0) 100%)"
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
        px={{ base: '16px', sm: '23px' }}
        gap={{ base: 3, sm: 0 }}
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
          rightIcon={
            <ArrowForwardIcon display={{ base: 'none', sm: 'block' }} />
          }
          color="#222"
          bg="#fff"
          borderRadius="8px"
          fontWeight={500}
          px={6}
          py={2}
          _hover={{ bg: 'gray.100' }}
          zIndex={3}
          mb={4}
          h={{ base: '55px', sm: 'unset' }}
          fontSize={{ base: '12px', sm: '16px' }}
          whiteSpace="nowrap"
        >
          <VStack
            spacing={0}
            align="center"
            display={{ base: 'flex', sm: 'none' }}
          >
            <Text>Explore</Text>
            <Flex align="center" gap={1}>
              <Text>Collection</Text>
              <ArrowForwardIcon />
            </Flex>
          </VStack>
          <Text display={{ base: 'none', sm: 'block' }}>
            Explore collection
          </Text>
        </Button>
      </Flex>
    </Box>
  );
};

export { CollectionsContent };
