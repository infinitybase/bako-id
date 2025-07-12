import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  VStack,
  Heading,
  Text,
  Icon,
} from '@chakra-ui/react';
import { InfoCircleIcon } from '../icons';
import { VerifiedBadgeIcon } from '../icons/verifiedBadgeIcon';
import { CopyText } from '@/components/helpers/copy';
import { GlobalIcon, TwitterIcon } from '../icons';
import { DiscordIcon as DiscordIconComponent } from '@/components/icons/discordIcon';
import { ShareMenu } from './shareMenu';
import { useRef } from 'react';
import { CloseIcon } from '@/components/icons/closeIcon';
import type { Collection } from '@/types/marketplace';
import { ImageLoader } from '@/components/imageLoader';

const DetailsMenu = ({ collection }: { collection: Collection }) => {
  const menuRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    if (menuRef.current) {
      menuRef.current.click();
    }
  };

  return (
    <Menu
      styleConfig={{
        menu: {
          bg: 'transparent',
          border: 'none',
        },
      }}
    >
      <MenuButton ref={menuRef} h={4}>
        <Icon as={InfoCircleIcon} color="grey.200" />
      </MenuButton>
      <MenuList p={0}>
        <MenuItem p={0} m={0} h="full">
          <Flex
            p={6}
            w="540px"
            alignItems="flex-start"
            justifyContent="center"
            mb={2.5}
            bg="background.900"
            flexDir="column"
            borderRadius="10px"
            onClick={(e) => e.stopPropagation()}
            position="relative"
          >
            <Flex
              align="center"
              gap={2}
              h="100px"
              onClick={(e) => e.stopPropagation()}
              w="full"
            >
              <ImageLoader
                skeletonProps={{
                  w: '133px',
                  h: '102px',
                  borderRadius: '8px',
                }}
                src={collection.config.avatar}
                alt={collection.name}
                imageProps={{
                  boxSize: 'full',
                  borderRadius: '8px',
                }}
              />
              <VStack align="flex-start" spacing={4} w="full">
                <Flex w="full" justify="space-between" align="center">
                  <Heading
                    fontSize="2xl"
                    fontWeight={700}
                    color="#fff"
                    noOfLines={1}
                  >
                    {collection.name}
                  </Heading>
                  <Icon
                    as={CloseIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                    _hover={{ color: 'white' }}
                  />
                </Flex>
                <Flex
                  align="center"
                  border="1px solid white"
                  borderRadius="lg"
                  pl={2}
                  pr={1}
                  gap={1}
                  bg="#F5F5F51A"
                  backdropFilter="blur(24px)"
                >
                  <Text color="text.700" fontSize="xs" fontWeight={400}>
                    By someone
                  </Text>
                  <Icon as={VerifiedBadgeIcon} w={4} h={4} />
                </Flex>
                <Flex
                  gap={4}
                  align="center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Flex gap={4} mt={1} onClick={(e) => e.stopPropagation()}>
                    <CopyText
                      useNewCopyIcon
                      value={collection.id}
                      color="grey.200"
                    />
                    <Icon
                      as={GlobalIcon}
                      color="grey.200"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Icon
                      as={TwitterIcon}
                      color="grey.200"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Icon
                      as={DiscordIconComponent}
                      w={5}
                      h={5}
                      color="grey.200"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <ShareMenu />
                  </Flex>
                </Flex>
              </VStack>
            </Flex>

            <Text color="section.500" fontSize="xs" fontWeight={400} mt={6}>
              {collection.description}
            </Text>
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export { DetailsMenu };
