import { Flex, Stack, Text } from '@chakra-ui/react';
import { NftMetadataBlock } from './NftMetadataBlock';

type Metadata = {
  label: string;
  value: string;
};

interface NftListMetadataProps {
  metadata: Metadata[];
}

export const NftListMetadata = ({ metadata }: NftListMetadataProps) => {
  return (
    <Stack spacing={2}>
      <Text>Metadata</Text>
      <Flex
        gap={2}
        flexWrap="wrap"
        flexDirection={{
          base: 'column',
          sm: 'row',
        }}
      >
        {metadata.map((item) => (
          <NftMetadataBlock
            key={item.value}
            title={item.label}
            value={item.value}
          />
        ))}
        {metadata.length === 0 && (
          <Text fontSize="sm" color="grey.subtitle">
            No metadata available.
          </Text>
        )}
      </Flex>
    </Stack>
  );
};
