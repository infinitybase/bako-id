import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { ShareIcon2 } from '../icons/shareIcon2';
import { TwitterIcon } from '../icons/twitterIcon';
import { DiscordIcon } from '@/components/icons/discordIcon';
import { CopyIcon2 } from '../icons';

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
  {
    icon: DiscordIcon,
    label: 'Share on Discord',
    key: 'discord',
  },
];

export const ShareMenu = ({
  discordLink,
  xLink,
}: {
  discordLink?: string;
  xLink?: string;
}) => {
  const handleOnClick = (key: string) => {
    switch (key) {
      case 'link':
        navigator.clipboard.writeText(window.location.href);
        break;
      case 'x':
        window.open(xLink, '_blank');
        break;
      case 'discord':
        window.open(discordLink, '_blank');
        break;
    }
  };

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        icon={<ShareIcon2 />}
        variant="ghost"
        _hover={{ bg: 'transparent' }}
        _focus={{ bg: 'transparent', border: 'none', outline: 'none' }}
        _active={{ bg: 'transparent', border: 'none' }}
        _focusVisible={{ bg: 'transparent', border: 'none', outline: 'none' }}
        aria-label="Share"
        p={0}
        minW="1px"
        h={4}
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
            borderBottom={index !== menuItems.length - 1 ? '1px solid' : 'none'}
            borderColor="grey.300"
            onClick={() => handleOnClick(item.key)}
            cursor={
              (!discordLink && item.key === 'discord') ||
              (!xLink && item.key === 'x')
                ? 'not-allowed'
                : 'pointer'
            }
            pointerEvents={
              (!discordLink && item.key === 'discord') ||
              (!xLink && item.key === 'x')
                ? 'none'
                : 'auto'
            }
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
  );
};
