import { ImageLoader } from '@/components/imageLoader';
import { useMintToken } from '@/hooks/marketplace/useMintToken';
import { parseURI } from '@/utils/formatter';
import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { AssetInfo, BN } from 'fuels';
import type { CollectionConfig } from '../../utils/mint';
import MintPanelSkeleton from '../skeletons/mintPanelSkeleton';
import MintContent from './mintContent';

const MAX_PER_WALLET = 70;

type MintPanelProps = {
  collectionId?: string;
  maxSupply: string;
  totalMinted: string;
  mintPrice: BN;
  config: CollectionConfig | undefined;
  asset: AssetInfo | null | undefined;
  isLoading: boolean;
  wasAllSupplyMinted: boolean;
  collectionName: string;
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
  collectionName,
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
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap={4}
          align="flex-start"
          justifyContent="space-between"
        >
          <ImageLoader
            src={parseURI(config?.previews?.[0] ?? config?.avatar ?? '')}
            skeletonProps={{
              boxSize: 'full',
              borderRadius: 'lg',
              bg: 'grey.900',
              maxW: { base: 'full', sm: '500px', md: '480px', lg: 'auto' },
            }}
            imageProps={{
              boxSize: 'full',
              borderRadius: 'lg',
              objectFit: 'cover',
            }}
            alt="NFT preview"
          />
          <Stack
            direction={{ base: 'row', sm: 'column' }}
            spacing={{ base: 1, sm: 4 }}
            ml={{ base: 0, sm: 'auto' }}
            w={{ base: 'full', sm: 'fit-content' }}
            justifyContent={{ base: 'space-between', sm: 'flex-start' }}
            alignItems={{ base: 'center', sm: 'flex-end' }}
          >
            {config?.previews?.map((img, idx) => (
              <Image
                key={img}
                src={img}
                alt={`NFT thumbnail ${idx + 1}`}
                boxSize={{ base: '90px', sm: '113px' }}
                borderRadius="md"
                objectFit="cover"
                bg="gray.900"
              />
            ))}
          </Stack>
        </Flex>
        <MintContent
          title={`Minting ${collectionName}`}
          description={config?.description ?? ''}
          progress={Number(totalMinted)}
          maxSupply={Number(maxSupply)}
          maxPerWallet={MAX_PER_WALLET}
          tokenPrice={mintPrice}
          isMinting={isPending}
          onMint={mintToken}
          asset={asset}
          wasAllSupplyMinted={wasAllSupplyMinted}
        />
      </Flex>

      {config?.about?.map((about) => (
        <Grid
          gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
          key={`about-${Math.random()}`}
          gap={{ base: 4, sm: '60px', md: '173px' }}
          my={6}
          py={{ base: 10, sm: '72px' }}
          borderTop="1px solid"
          borderColor="grey.600"
        >
          {about.map((item) => {
            if (item.type === 'image') {
              return (
                <GridItem>
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
                </GridItem>
              );
            }

            return (
              <GridItem
                key={item.title}
                gap={4}
                as={Flex}
                align={item.align}
                justify="center"
                flexDir="column"
              >
                <Heading color="white" fontSize="sm">
                  {item.title}
                </Heading>
                <Text fontSize="xs" color="section.500">
                  {item.text}
                </Text>
              </GridItem>
            );
          })}
        </Grid>
      ))}
    </>
  );
};

export default MintPanel;
