import type { Collection } from '@/types/marketplace';
import { Box, Heading, Icon, Text } from '@chakra-ui/react';
import { MobileCollectionItem } from './mobileCollectionItem';
import { DoubleRightArrowIcon } from '../icons/doubleRightArrowIcon';

type MobileCollectionListProps = {
  collections: Collection[];
  isLoading: boolean;
};

export const MobileCollectionList = ({
  collections,
  isLoading,
}: MobileCollectionListProps) => {
  const isEmptyCollections = !collections?.length;

  return (
    <Box
      position="relative"
      border="1px solid"
      borderColor="grey.600"
      borderRadius="8px 0 0 8px"
      pt={20}
      pl={2}
    >
      {isEmptyCollections && !isLoading && (
        <Heading size="md" textAlign="center">
          No collections available
        </Heading>
      )}

      {/* Gradient */}
      <Box
        bg="input.600"
        boxShadow="4px 0px 16px 0px #00000040"
        borderRadius="8px 0 0 0"
        position="absolute"
        left={0}
        bottom={0}
        w={{
          base: '210px',
          sm: '250px',
        }}
        h="100%"
      >
        <Text mt={8} ml={3}>
          Collection
        </Text>
      </Box>
      <Icon
        as={DoubleRightArrowIcon}
        color="grey.400"
        zIndex={10}
        ml={2}
        position="absolute"
        right="40%"
        top={9}
      />

      {collections.map((col) => (
        <MobileCollectionItem key={col.id} col={col} />
      ))}
    </Box>
  );
};
