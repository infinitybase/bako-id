import { useCustomToast } from '@/components';
import { CopyIcon } from '@/components/icons/copyIcon';
import { ShareIcon2 } from '@/components/icons/shareIcon2';
import { TwitterIcon } from '@/modules/marketplace/components/icons';
import { twitterLink } from '@/utils/formatter';
import { Networks, resolveNetwork } from '@/utils/resolverNetwork';
import { slugify } from '@/utils/slugify';
import { shortenUrl } from '@/utils/urlShortner';
const MarketplaceAPIURL = import.meta.env.VITE_MARKETPLACE_URL;
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useProvider } from '@fuels/react';

export default function ShareOrder({
  orderId,
  nftName,
  collectionName,
  onlyShareButton = false,
  twitterTitle,
}: {
  orderId: string;
  nftName: string;
  collectionName: string;
  onlyShareButton?: boolean;
  twitterTitle?: string;
}) {
  const slugifiedCollectionName = slugify(collectionName);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { successToast } = useCustomToast();
  const { provider } = useProvider();
  const chainId =
    provider?.url?.includes('mainnet') || !provider
      ? Networks.MAINNET
      : Networks.TESTNET;

  const network = resolveNetwork(chainId).toLowerCase();

  const twitterCardUrl = `${MarketplaceAPIURL}/${network}/orders/s/${orderId}`;
  const orderLink = `${import.meta.env.VITE_MARKETPLACE_UI_URL}/collection/${slugifiedCollectionName}/order/${orderId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(orderLink);
    successToast({
      title: 'Link copied',
      description: 'The sale link has been copied to your clipboard.',
    });
    onClose();
  };

  const handleShareOnX = async () => {
    const shortUrl = await shortenUrl(twitterCardUrl);
    window.open(
      twitterLink(shortUrl, {
        title: twitterTitle
          ? twitterTitle
          : `Just listed my ${nftName} on @garagedotzone. Grab it here:`,
        related: [],
      })
    );
  };

  return (
    <>
      {onlyShareButton ? (
        <Button variant="mktPrimary" w="full" onClick={handleShareOnX}>
          Share on <Icon ml={1} as={TwitterIcon} />
        </Button>
      ) : (
        <Menu
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          placement="top-end"
        >
          <MenuButton>
            <ShareIcon2 />
          </MenuButton>
          <MenuList bg="input.600" rounded="lg" borderColor="grey.600">
            <MenuItem
              bg="input.600"
              cursor="pointer"
              icon={<TwitterIcon fontSize="md" />}
              onClick={handleShareOnX}
            >
              <Text>Share on X</Text>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              bg="input.600"
              cursor="pointer"
              icon={<CopyIcon fontSize="md" />}
              onClick={handleCopyLink}
            >
              <Text>Copy sale link</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
}
