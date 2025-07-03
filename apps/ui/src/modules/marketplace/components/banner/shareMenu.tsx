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
    link: '',
  },
  {
    icon: TwitterIcon,
    label: 'Share on X',
    link: '',
  },
  {
    icon: DiscordIcon,
    label: 'Share on Discord',
    link: '',
  },
];

export const ShareMenu = () => (
  <Menu placement="bottom-end" strategy="fixed">
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
        >
          <Flex
            w="full"
            align="center"
            justify="space-between"
            color="grey.200"
            _hover={{ color: 'white' }}
          >
            <Text fontSize="xs">{item.label}</Text>
            <Icon as={item.icon} />
          </Flex>
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
);
