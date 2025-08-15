import { TwitterIcon, useCustomToast } from '@/components';
import { CopyIcon } from '@/components/icons/copyIcon';
import { ShareIcon2 } from '@/components/icons/shareIcon2';
import { twitterLink } from '@/utils/formatter';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

export default function ShareOrder({
  orderId,
  collectionId,
  nftName,
}: { orderId: string; collectionId: string; nftName: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { successToast } = useCustomToast();

  const orderLink = `${import.meta.env.VITE_MARKETPLACE_UI_URL}/collection/${collectionId}/order/${orderId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(orderLink);
    successToast({
      title: 'Link copied',
      description: 'The sale link has been copied to your clipboard.',
    });
    onClose();
  };

  return (
    <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="top-end">
      <MenuButton>
        <ShareIcon2 />
      </MenuButton>
      <MenuList bg="input.600" rounded="lg" borderColor="grey.600">
        <MenuItem
          bg="input.600"
          cursor="pointer"
          icon={<TwitterIcon fontSize="md" />}
          onClick={() => {
            window.open(
              twitterLink(orderLink, {
                title: `Just listed my ${nftName} on Bako Marketplace. Grab it here:`,
                related: [],
              })
            );
          }}
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
  );
}
