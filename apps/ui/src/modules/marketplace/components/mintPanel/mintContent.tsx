import UnknownAsset from '@/assets/unknown-asset.png';
import { convertToUsd, formatAmount } from '@/utils/convertToUsd';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Progress,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useAccount, useBalance, useConnectUI } from '@fuels/react';
import { bn, type AssetInfo, type BN } from 'fuels';
import { useEffect, useMemo, useState } from 'react';

type MintContentProps = {
  title: string;
  description: string;
  progress: number;
  maxSupply: number;
  maxPerWallet: number;
  tokenPrice: BN;
  isMinting: boolean;
  asset: AssetInfo | null | undefined;
  onMint: (quantity: number) => void;
  wasAllSupplyMinted: boolean;
};

const MintContent = ({
  title,
  description,
  progress,
  maxSupply,
  maxPerWallet,
  tokenPrice,
  isMinting,
  asset,
  onMint,
  wasAllSupplyMinted,
}: MintContentProps) => {
  const [quantity, setQuantity] = useState(1);
  const remainingSupply = useMemo(() => {
    if (maxSupply) return maxSupply - progress;
  }, [progress, maxSupply]);

  const { connect, isConnected, isConnecting } = useConnectUI();
  const { account } = useAccount();
  const {
    balance: walletAssetBalance,
    isLoading: isLoadingWalletBalance,
    isFetching: isFetchingBalance,
  } = useBalance({
    address: account,
    assetId: asset?.assetId,
  });

  const progressPercentage = useMemo(
    () => (progress / maxSupply) * 100,
    [progress, maxSupply]
  );

  const mintPrice = useMemo(
    () =>
      formatAmount({
        amount: tokenPrice.mul(quantity),
        options: {
          units: asset?.decimals || 0,
          precision: Math.min(asset?.decimals || 0, 3),
        },
      }),
    [tokenPrice, quantity, asset?.decimals]
  );

  const notEnoughBalance = useMemo(() => {
    if (isLoadingWalletBalance || !walletAssetBalance) return true;

    return walletAssetBalance.lt(bn(tokenPrice.mul(quantity).toString()));
  }, [walletAssetBalance, isLoadingWalletBalance, tokenPrice, quantity]);

  const usdPrice = useMemo(
    () =>
      convertToUsd(
        tokenPrice?.mul(quantity),
        asset?.decimals ?? 0,
        asset?.rate ?? 0
      ).formatted,
    [tokenPrice, quantity, asset?.decimals, asset?.rate]
  );

  const handleMint = () => {
    if (!isConnected && !isConnecting) {
      connect();
      return;
    }
    onMint(quantity);
  };

  useEffect(() => {
    if (remainingSupply && quantity > remainingSupply) {
      setQuantity(remainingSupply);
    }
  }, [remainingSupply, quantity]);

  return (
    <Flex
      flex="1"
      minW="260px"
      direction="column"
      justifyContent="space-between"
    >
      <Flex direction="column" gap={4}>
        <Heading fontSize="18px" mb={2}>
          {title}
        </Heading>
        <Text fontSize="xs" color="section.500" mb={4}>
          {description}
        </Text>
      </Flex>

      <Stack bg="input.600" borderRadius="8px" p={4} gap={4}>
        <Box>
          <Flex align="center" justify="space-between" mb={1}>
            <Text fontSize="sm">{progressPercentage.toFixed(2)}% minted</Text>
            <Text fontSize="xs" color="grey.400">
              {progress}/{maxSupply}
            </Text>
          </Flex>
          <Progress
            value={progressPercentage}
            size="sm"
            sx={{
              '& > div[role="progressbar"]': {
                background: 'garage.100',
              },
            }}
            borderRadius="md"
          />
        </Box>
        {/* <Text fontSize="xs" color="grey.400" ml="auto">
          Limit {maxPerWallet} per wallet
        </Text> */}
        <Stack direction="row" justify="space-between" align="center" mt={4}>
          <Flex align="center" gap={1}>
            <Image
              w={35}
              src={asset?.icon ?? UnknownAsset}
              alt="ETH"
              rounded="full"
            />
            <Flex align="center" gap={2} w="full">
              <Text fontWeight="bold" fontSize="sm">
                {mintPrice} {asset?.symbol}
              </Text>
              <Text fontSize="xs" color="grey.400">
                {usdPrice}
              </Text>
            </Flex>
          </Flex>
          {!wasAllSupplyMinted && (
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
                onClick={() => setQuantity((q) => q + 1)}
                isDisabled={
                  quantity >= maxPerWallet ||
                  Boolean(remainingSupply && quantity >= remainingSupply)
                }
              />
            </Flex>
          )}
        </Stack>
        <Tooltip label={notEnoughBalance ? 'Not enough balance' : ''}>
          <Button
            mt={wasAllSupplyMinted ? 4 : 0}
            variant="mktPrimary"
            size="lg"
            w="full"
            fontWeight="bold"
            borderRadius="md"
            letterSpacing=".5px"
            onClick={handleMint}
            isLoading={isMinting}
            isDisabled={
              isMinting ||
              wasAllSupplyMinted ||
              notEnoughBalance ||
              isFetchingBalance
            }
          >
            {wasAllSupplyMinted
              ? 'Minted'
              : `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`}
          </Button>
        </Tooltip>
      </Stack>
    </Flex>
  );
};

export default MintContent;
