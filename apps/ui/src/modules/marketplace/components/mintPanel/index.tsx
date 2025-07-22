import { Flex, Image, Stack } from '@chakra-ui/react';
import MintContent from './mintContent';
import MoreInfo from './moreInfo';

const NFT_IMAGES = [
  'https://i.imgur.com/1Q9Z1Zm.png',
  'https://i.imgur.com/2Q9Z1Zm.png',
  'https://i.imgur.com/3Q9Z1Zm.png',
  'https://i.imgur.com/4Q9Z1Zm.png',
];

const MAX_SUPPLY = 200;
const MINTED = 50;
const PRICE_ETH = 0.01875;
const PRICE_USD = 520.89;
const MAX_PER_WALLET = 5;
const description =
  'Unlock the future of secure digital assets with the Bako Safe NFT. This exclusive, limited-edition token represents a unique piece of the Bako Safe ecosystem, where cutting-edge security meets innovative technology. Owning this NFT grants you a rare digital collectible that symbolizes the ultimate in safety and privacy for your virtual world. With its sleek design and powerful encryption roots, the Bako Safe NFT is not just a collectible, but a key to a secure future.';

const MintPanel = () => {
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
          <Image
            src={NFT_IMAGES[0]}
            alt="NFT preview"
            boxSize="500px"
            borderRadius="lg"
            objectFit="cover"
            bg="gray.900"
          />
          <Stack direction="column" spacing={4} ml={2}>
            {NFT_IMAGES.map((img, idx) => (
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
          title="Minting Fuel Pengus"
          description={description}
          progress={MINTED}
          maxSupply={MAX_SUPPLY}
          maxPerWallet={MAX_PER_WALLET}
          priceEth={PRICE_ETH}
          priceUsd={PRICE_USD}
        />
      </Flex>

      <MoreInfo
        borderTop="1px solid"
        borderColor="grey.600"
        pt={6}
        mt={6}
        title="Another information about this collection"
        description={description}
        h={{ base: 'full', md: '414px' }}
      />
      <MoreInfo
        borderTop="1px solid"
        borderColor="grey.600"
        pt={6}
        mt={6}
        title="Another information about this collection"
        description={description}
        h={{ base: 'full', md: '414px' }}
        reverse
      />
    </>
  );
};

export default MintPanel;
