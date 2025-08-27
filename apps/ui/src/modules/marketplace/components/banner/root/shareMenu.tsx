import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Flex,
  Icon,
  Text,
  Button,
} from '@chakra-ui/react';
import { CopyIcon2 } from '../../icons';
import { ShareIcon2 } from '../../icons/shareIcon2';
import { TwitterIcon } from '../../icons/twitterIcon';
import { twitterLink } from '@/utils/formatter';
import { useProvider } from '@fuels/react';
import { Networks, resolveNetwork } from '@/utils/resolverNetwork';
import { shortenUrl } from '@/utils/urlShortner';
const MarketplaceAPIURL = import.meta.env.VITE_MARKETPLACE_URL;
const menuItems = [
  {
    icon: CopyIcon2,
    label: 'Copy link',
    key: 'link',
  },
  {
    icon: TwitterIcon,
    label: 'Share on X',
    key: 'x',
  },
];

export const ShareMenu = ({
  collectionIdOrSlug,
  collectionName,
  onlyShareOnX = false,
  twitterTitle,
}: {
  collectionIdOrSlug: string;
  collectionName: string;
  onlyShareOnX?: boolean;
  twitterTitle?: string;
}) => {
  const { provider } = useProvider();
  const chainId =
    provider?.url?.includes('mainnet') || !provider
      ? Networks.MAINNET
      : Networks.TESTNET;
  const network = resolveNetwork(chainId).toLowerCase();

  const twitterUrl = `${MarketplaceAPIURL}/${network}/collections/s/${collectionIdOrSlug}`;

  const handleShareOnX = async () => {
    const shortUrl = await shortenUrl(twitterUrl);
    window.open(
      twitterLink(shortUrl, {
        title: twitterTitle ?? `${collectionName} on @garagedotzone:`,
        related: [],
      })
    );
  };
  const handleOnClick = async (key: string) => {
    switch (key) {
      case 'x': {
        handleShareOnX();
        break;
      }
      case 'link':
        navigator.clipboard.writeText(window.location.href);
        break;
    }
  };

  return (
    <>
      {onlyShareOnX ? (
        <Button variant="mktPrimary" w="full" onClick={handleShareOnX}>
          Share on <Icon ml={1} as={TwitterIcon} />
        </Button>
      ) : (
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            icon={<ShareIcon2 />}
            variant="ghost"
            color="grey.200"
            _hover={{ bg: 'transparent', color: 'white' }}
            _focus={{ bg: 'transparent', border: 'none', outline: 'none' }}
            _active={{ bg: 'transparent', border: 'none' }}
            _focusVisible={{
              bg: 'transparent',
              border: 'none',
              outline: 'none',
            }}
            aria-label="Share"
            p={0}
            minW="1px"
            h={4}
            transition="color 0.2s"
          />
          <MenuList
            bg="#181818"
            borderRadius="8px"
            boxShadow="0 6px 24px 0 #00000080"
            minW="180px"
            border="1px solid "
            borderColor="grey.300"
            p={0}
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={item.label}
                bg="transparent"
                w="full"
                fontSize="xs"
                borderBottom={
                  index !== menuItems.length - 1 ? '1px solid' : 'none'
                }
                borderColor="grey.300"
                onClick={() => handleOnClick(item.key)}
                cursor="pointer"
              >
                <Flex
                  w="full"
                  align="center"
                  justify="space-between"
                  color="grey.200"
                  _hover={{ color: 'white' }}
                >
                  <Text fontSize="xs">{item.label}</Text>
                  <Icon as={item.icon} color="grey.200" />
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </>
  );
};
