'use client';

import { LightIcon } from '@/components/icons';
import { BTCIcon } from '@/components/icons/btcicon';
import { ContractIcon } from '@/components/icons/contracticon';
import type { Order } from '@/types/marketplace';
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { NftListMetadata } from './NftListMetadata';
import { NftMetadataBlock } from './NftMetadataBlock';
import { NftModal } from './modal';
import { useGetOrder } from '@/hooks/useGetOrder';

interface NftSaleCardModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  value: number;
  usdValue: string;
  name: string;
  imageUrl: string;
  chainId: number;
}

export const NftSaleCardModal = ({
  isOpen,
  onClose,
  name,
  imageUrl,
  value,
  usdValue,
  order,
  chainId,
}: NftSaleCardModalProps) => {
  const { order: orderData } = useGetOrder({ id: order.id, chainId });

  return (
    <NftModal.Root isOpen={isOpen} onClose={onClose}>
      <NftModal.Content
        flexDirection={{
          base: 'column',
          md: 'row',
        }}
        maxH="540px"
        overflowY={{
          base: 'scroll',
          md: 'hidden',
        }}
      >
        <NftModal.Image src={imageUrl} alt={name} />
        <Stack
          gap={8}
          w="full"
          overflowY={{
            base: 'unset',
            md: 'scroll',
          }}
          style={{ scrollbarWidth: 'none' }}
          maxH={{ md: '480px' }}
        >
          <Heading>{name}</Heading>
          <Stack spacing={2}>
            <Text>Description</Text>
            <Text fontSize="sm" color="grey.subtitle">
              {orderData?.asset.metadata?.description ??
                'Description not provided.'}
            </Text>
          </Stack>

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <NftMetadataBlock
                title="Asset ID"
                value={orderData?.asset.id ?? ''}
                icon={<BTCIcon />}
                isCopy
              />
            </GridItem>

            {orderData?.collection.name && (
              <GridItem>
                <NftMetadataBlock
                  title="Creator"
                  value={orderData?.collection.name}
                  icon={<LightIcon />}
                />
              </GridItem>
            )}

            <GridItem>
              <NftMetadataBlock
                title="Contract ID"
                value={orderData?.collection.address ?? 'N/A'}
                icon={<ContractIcon />}
                isCopy
              />
            </GridItem>
          </Grid>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center" gap={2}>
              <Image
                src={orderData?.price.image}
                alt="Asset icon"
                height={6}
                width={6}
              />
              <Text fontSize="sm" color="grey.title" fontWeight="semibold">
                {value}
              </Text>
              <Text fontSize="sm" color="grey.subtitle">
                ~ {usdValue}
              </Text>
            </Flex>
          </Stack>

          <Button
            variant="primary"
            as={Link}
            href={`${process.env.NEXT_PUBLIC_APP_URL}/marketplace/order/${order.id}`}
            py={2}
          >
            Buy
          </Button>

          <NftListMetadata
            metadata={orderData?.asset.metadata?.attributes ?? []}
          />
        </Stack>

        <NftModal.CloseIcon onClose={onClose} />
      </NftModal.Content>
    </NftModal.Root>
  );
};
