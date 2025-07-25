import { Box, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import MintContent from './mintContent';
import { parseURI } from '@/utils/formatter';
import { ImageLoader } from '@/components/imageLoader';
import MintPanelSkeleton from '../skeletons/mintPanelSkeleton';
import { useMintToken } from '@/hooks/marketplace/useMintToken';
import type { AssetInfo, BN } from 'fuels';
import type { CollectionConfig } from '../../utils/mint';

type MintPanelProps = {
  collectionId?: string;
  maxSupply: string;
  totalMinted: string;
  mintPrice: BN;
  config: CollectionConfig | undefined;
  asset: AssetInfo | null | undefined;
  isLoading: boolean;
  wasAllSupplyMinted: boolean;
};

const MintPanel = ({
  collectionId,
  maxSupply,
  totalMinted,
  mintPrice,
  config,
  asset,
  isLoading,
  wasAllSupplyMinted,
}: MintPanelProps) => {
  if (!collectionId) return null;

  const { mintToken, isPending } = useMintToken(collectionId);

  if (!collectionId) return null;
  if (isLoading) return <MintPanelSkeleton />;

  return (
    <>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        color="white"
        borderRadius="lg"
        gap={6}
        mt={6}
        w="full"
        maxW="container.xl"
      >
        <Flex direction="row" gap={4} align="flex-start">
          <ImageLoader
            src={parseURI(config?.avatar ?? '')}
            skeletonProps={{
              boxSize: '500px',
              borderRadius: 'lg',
              bg: 'grey.900',
              objectFit: 'cover',
            }}
            imageProps={{
              boxSize: '500px',
              borderRadius: 'lg',
              objectFit: 'cover',
            }}
            alt="NFT preview"
          />
          <Stack direction="column" spacing={4} ml={2}>
            {config?.previews?.map((img, idx) => (
              <Image
                key={img}
                src={img}
                alt={`NFT thumbnail ${idx + 1}`}
                boxSize="113px"
                borderRadius="md"
                objectFit="cover"
                bg="gray.900"
              />
            ))}
          </Stack>
        </Flex>
        <MintContent
          title={`Minting ${config?.name}`}
          description={config?.description ?? ''}
          progress={Number(totalMinted)}
          maxSupply={Number(maxSupply)}
          // maxPerWallet={MAX_PER_WALLET}
          tokenPrice={mintPrice}
          isMinting={isPending}
          onMint={mintToken}
          asset={asset}
          wasAllSupplyMinted={wasAllSupplyMinted}
        />
      </Flex>

      {config?.about?.map((about) => (
        <Flex
          key={`about-${Math.random()}`}
          gap="173px"
          my={6}
          py="72px"
          borderTop="1px solid"
          borderColor="grey.600"
        >
          {about.map((item) => {
            if (item.type === 'image') {
              return (
                <Box maxW="480px" h="270px" flex={1}>
                  <ImageLoader
                    key={item.value}
                    src={item.value}
                    alt="NFT Section Image"
                    skeletonProps={{
                      boxSize: 'full',
                    }}
                    imageProps={{
                      boxSize: 'full',
                    }}
                  />
                </Box>
              );
            }

            return (
              <Flex
                key={item.title}
                gap={4}
                align={item.align}
                justify="center"
                flexDir="column"
                flex={1}
              >
                <Heading color="white" fontSize="sm">
                  {item.title}
                </Heading>
                <Text fontSize="xs" color="section.500">
                  {item.text}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      ))}
    </>
  );
};

export default MintPanel;
