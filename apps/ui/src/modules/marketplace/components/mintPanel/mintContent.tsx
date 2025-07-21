import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Stack,
  Progress,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import BlueEthIcon from '@/assets/marketplace/blue-eth.svg';

const MintContent = (props: {
  title: string;
  description: string;
  progress: number;
  maxSupply: number;
  maxPerWallet: number;
  priceEth: number;
  priceUsd: number;
}) => {
  const [quantity, setQuantity] = useState(1);
  const progress = (props.progress / props.maxSupply) * 100;
  return (
    <Flex
      flex="1"
      minW="260px"
      direction="column"
      justifyContent="space-between"
    >
      <Flex direction="column" gap={4}>
        <Heading fontSize="18px" mt={6} mb={2}>
          {props.title}
        </Heading>
        <Text color="white" fontWeight={700} fontSize="sm">
          Description
        </Text>
        <Text fontSize="xs" color="section.500" mb={4}>
          {props.description}
        </Text>
      </Flex>

      <Stack bg="input.600" borderRadius="8px" p={4} gap={4}>
        <Box>
          <Flex align="center" justify="space-between" mb={1}>
            <Text fontSize="sm">{Math.round(progress)}% minted</Text>
            <Text fontSize="xs" color="grey.400">
              {props.progress}/{props.maxSupply}
            </Text>
          </Flex>
          <Progress
            value={progress}
            size="sm"
            sx={{
              '& > div[role="progressbar"]': {
                background: 'garage.100',
              },
            }}
            borderRadius="md"
          />
        </Box>
        <Text fontSize="xs" color="grey.400" ml="auto">
          Limit {props.maxPerWallet} per wallet
        </Text>
        <Stack direction="row" justify="space-between" align="center">
          <Flex align="center" gap={1}>
            <Image src={BlueEthIcon} alt="ETH" rounded="full" />
            <Flex align="center" gap={2} w="full">
              <Text fontWeight="bold" fontSize="sm">
                0{props.priceEth} ETH
              </Text>
              <Text fontSize="xs" color="grey.400">
                $
                {props.priceUsd.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Text>
            </Flex>
          </Flex>
          <Flex
            align="center"
            gap={2}
            bg="background.900"
            borderRadius="8px"
            border="1px solid"
            borderColor="grey.500"
          >
            <IconButton
              aria-label="Decrease quantity"
              bg="transparent"
              _hover={{ bg: 'grey.600' }}
              border="none"
              icon={<MinusIcon />}
              color="white"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              isDisabled={quantity <= 1}
            />
            <Text
              fontWeight="bold"
              fontSize="lg"
              minW="32px"
              textAlign="center"
            >
              {quantity}
            </Text>
            <IconButton
              aria-label="Increase quantity"
              icon={<AddIcon />}
              color="white"
              bg="transparent"
              _hover={{ bg: 'grey.600' }}
              border="none"
              onClick={() =>
                setQuantity((q) => Math.min(props.maxPerWallet, q + 1))
              }
              isDisabled={quantity >= props.maxPerWallet}
            />
          </Flex>
        </Stack>
        <Button
          variant="mktPrimary"
          size="lg"
          w="full"
          fontWeight="bold"
          borderRadius="md"
          letterSpacing=".5px"
        >
          Mint {quantity} NFT{quantity > 1 ? 's' : ''}
        </Button>
      </Stack>
    </Flex>
  );
};

export default MintContent;
