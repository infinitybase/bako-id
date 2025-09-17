import NftOwned from '@/assets/marketplace/nft-owned.svg';
import { Button, Flex, Heading, Icon, Image, Stack } from '@chakra-ui/react';
import ShareOrder from '../ShareOrder';
import type { Order } from '@/types/marketplace';
import { CloseIcon } from '@/components/icons/closeIcon';
import { useScreenSize } from '@/hooks';
import { useListNowStore } from '@/modules/marketplace/stores/listNowStore';
import { useNavigate } from '@tanstack/react-router';
import { useWallet } from '@fuels/react';

type NftSuccessStepProps = {
  orderData: Order;
  nftName: string;
  collectionName: string;

  onClose: () => void;
};

export default function NftSuccessStep({
  orderData,
  nftName,
  collectionName,
  onClose,
}: NftSuccessStepProps) {
  const { isMobile } = useScreenSize();
  const { wallet } = useWallet();
  const { addNftIdToList } = useListNowStore();
  const navigate = useNavigate();
  const userAddress = wallet?.address.toB256();

  const handleOnListNow = () => {
    addNftIdToList(orderData.asset.id);
    navigate({
      to: `/profile/${userAddress}`,
    });
  };

  return (
    <Stack
      gap={4}
      w="full"
      style={{ scrollbarWidth: 'none' }}
      maxH={{ sm: '480px' }}
    >
      {!isMobile && (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          w="full"
          position={{
            base: 'relative',
            sm: 'sticky',
          }}
          bg="background.900"
          top={0}
          right={0}
          zIndex={1}
        >
          <Heading>{nftName}</Heading>
          <Icon as={CloseIcon} cursor="pointer" onClick={onClose} />
        </Flex>
      )}
      <Image
        src={NftOwned}
        alt="owned-nft"
        boxSize="full"
        w="full"
        mx="auto"
        objectFit="cover"
        objectPosition="center"
        maxW={{ base: 'full', sm: '500px', md: '480px' }}
        maxH={{ base: 'full', md: '365px' }}
      />
      <Flex gap={2}>
        <Button
          w="full"
          variant="secondary"
          onClick={handleOnListNow}
          _hover={{
            borderColor: 'garage.100',
            color: 'garage.100',
          }}
          borderColor="section.500"
          fontWeight={400}
          letterSpacing="1px"
        >
          List Now
        </Button>

        <ShareOrder
          orderId={orderData.id}
          nftName={nftName}
          collectionName={collectionName}
          onlyShareButton
          twitterTitle={`Just bought my ${nftName} on @garagedotzone`}
        />
      </Flex>
    </Stack>
  );
}
