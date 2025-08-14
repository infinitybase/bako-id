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
import { InfoCircleIcon } from '../../icons';
import { useRef } from 'react';
import { CloseIcon } from '@/components/icons/closeIcon';
import type { Collection } from '@/types/marketplace';
import { ImageLoader } from '@/components/imageLoader';
import { SocialActionsMenu } from './socialActionsMenu';

const DetailsMenu = ({ collection }: { collection: Collection }) => {
  const menuRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    if (menuRef.current) {
      menuRef.current.click();
    }
  };

  return (
    <Menu
      placement="bottom-start"
      strategy="fixed"
      styleConfig={{
        menu: {
          bg: 'transparent',
          border: 'none',
        },
      }}
    >
      <MenuButton
        ref={menuRef}
        h={4}
        mt={2}
        bg="transparent"
        color="grey.200"
        _hover={{ bg: 'transparent', color: 'white' }}
        _focus={{ bg: 'transparent' }}
        _active={{ bg: 'transparent' }}
        transition="color 0.2s"
      >
        <Icon as={InfoCircleIcon} color="inherit" transition="color 0.2s" />
      </MenuButton>
      <MenuList p={0} zIndex={200}>
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
            cursor="default"
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

                <SocialActionsMenu collection={collection} />
              </VStack>
            </Flex>

            <Text
              color="section.500"
              fontSize="xs"
              fontWeight={400}
              mt={6}
              maxW={{ base: '270px', sm: 'full' }}
              w="full"
              whiteSpace="pre-wrap"
              textOverflow="ellipsis"
            >
              {collection.config.description}
            </Text>
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export { DetailsMenu };
