import UnknownAsset from '@/assets/unknown-asset.png';
import { Dialog } from '@/components';
import { useListAssets } from '@/hooks/marketplace/useListAssets';
import { useAssetsBalance } from '@/hooks/useAssetsBalance';
import { CloseIcon } from '@chakra-ui/icons';
import {
  CircularProgress,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  List,
  ListItem,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

interface NftSearchAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: { id: string; name?: string; icon?: string }) => void;
}

export const NftSearchAssetModal = ({
  isOpen,
  onClose,
  onSelect,
}: NftSearchAssetModalProps) => {
  const [search, setSearch] = useState('');
  const { assets, isLoading: isAssetsLoading } = useListAssets();

  const { data, isLoading: isBalancesLoading } = useAssetsBalance({ assets });

  const isLoading = isAssetsLoading || isBalancesLoading;

  const filteredAssets = useMemo(() => {
    return (
      data?.filter((asset) => {
        const name = asset.metadata?.name?.toLowerCase() ?? '';
        const symbol = asset.metadata?.symbol?.toLowerCase() ?? '';
        const searchLower = search.toLowerCase();

        return (
          name.includes(searchLower) ||
          symbol.includes(searchLower) ||
          asset.id.toLowerCase().includes(searchLower)
        );
      }) ?? []
    );
  }, [data, search]);

  const isEmpty = useMemo(() => filteredAssets.length === 0, [filteredAssets]);

  const handleSelect = (asset: {
    id: string;
    name?: string;
    icon?: string;
  }) => {
    onSelect(asset);
    onClose();
  };

  return (
    <Dialog.Modal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Assets"
      modalSubtitle="Send single or batch payments with multi assets. You can send multiple types of assets to different addresses."
    >
      <Stack gap={6} w="full">
        <FormControl position="relative">
          <CloseIcon
            position="absolute"
            right={3}
            top="50%"
            transform="translateY(-50%)"
            fontSize="sm"
            zIndex={99}
          />
          <Input
            size="lg"
            placeholder=" "
            variant="outlined"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <FormLabel fontSize="sm">Search asset</FormLabel>
        </FormControl>

        <Divider />

        <List spacing={2}>
          {!isLoading &&
            filteredAssets.map((asset) => (
              <ListItem
                key={asset.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={3}
                borderWidth={1}
                borderColor="grey.600"
                borderRadius="lg"
                borderStyle="solid"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: 'section.200',
                }}
                onClick={() =>
                  handleSelect({
                    id: asset.id,
                    name:
                      asset.metadata?.name ??
                      asset.metadata?.symbol ??
                      'Unknown Asset',
                    icon: asset.metadata?.icon ?? UnknownAsset,
                  })
                }
              >
                <Flex alignItems="center">
                  <Image
                    src={asset.metadata?.icon ?? UnknownAsset}
                    alt={asset.metadata?.name ?? 'Unknown Asset'}
                    boxSize="24px"
                    borderRadius="full"
                    mr={2}
                  />
                  <Text>{asset.metadata?.name}</Text>
                </Flex>

                <Stack spacing={1} direction="row" alignItems="center">
                  <Text>
                    {Number(
                      asset.balance?.formatUnits(asset.metadata?.decimals)
                    )}
                  </Text>
                  <Text textTransform="uppercase">
                    {asset.metadata?.symbol}
                  </Text>
                </Stack>
              </ListItem>
            ))}

          {!isLoading && isEmpty && (
            <ListItem>
              <Text>No assets found</Text>
            </ListItem>
          )}

          {isLoading && (
            <ListItem>
              <CircularProgress isIndeterminate size="24px" />
            </ListItem>
          )}
        </List>
      </Stack>
    </Dialog.Modal>
  );
};
