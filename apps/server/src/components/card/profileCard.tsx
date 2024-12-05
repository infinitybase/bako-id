import { Box, Button, Flex, Icon, Text, useMediaQuery } from '@chakra-ui/react';

import { MetadataKeys } from '@bako-id/sdk';
import { Card } from '.';
import { ExplorerTypes } from '../explorer';
import { AvatarIcon, ExploreIcon } from '../icons';

interface IProfileCard {
  domainName: string | null;
  domain: string;
  metadata: { key: string; value: string | undefined }[] | undefined;
  explorerUrl: string;
}

export const ProfileCard = ({
  domain,
  domainName,
  metadata,
  explorerUrl,
}: IProfileCard) => {
  const [isLowerThanMobile] = useMediaQuery('(max-width: 25em)');

  const nickname = metadata?.find(
    (m) => m.key === MetadataKeys.CONTACT_NICKNAME
  );
  const shortBio = metadata?.find((m) => m.key === MetadataKeys.CONTACT_BIO);
  const avatar = metadata?.find((m) => m.key === MetadataKeys.AVATAR);

  return (
    <Card
      w="full"
      h="fit-content"
      alignItems="flex-start"
      backdropFilter="blur(7px)"
      justifyContent="space-between"
      gap={4}
    >
      <Flex w="full">
        {avatar ? (
          <Box
            minW={32}
            minH={32}
            rounded="lg"
            mr={4}
            bgImage={`url(${avatar.value})`}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            border="1.5px solid"
            borderColor={'button.500'}
          />
        ) : (
          <Icon w={32} h={32} rounded="lg" mr={4} as={AvatarIcon} />
        )}
        <Flex
          gap={4}
          alignItems={isLowerThanMobile ? 'flex-start' : 'flex-start'}
          w="full"
          flexDir={isLowerThanMobile ? 'column' : 'row'}
          justifyContent="space-between"
        >
          <Flex gap={2.5} direction="column" alignItems="flex-start">
            <Text fontWeight="semibold" fontSize={['md', 'lg']} color="white">
              {domainName?.startsWith('@') ? domainName : `@${domainName}`}
            </Text>

            {nickname?.value && (
              <Text fontSize={['sm', 'md']} color="grey.200" ml={0.5}>
                {nickname.value}
              </Text>
            )}

            {/* <Flex gap={1} ml={0}>
              <FarcasterBadgeIcon w={8} h={8} />
              <DisabledXBadgeIcon w={8} h={8} />
            </Flex> */}
          </Flex>
          <Flex flexDir="column" gap={2}>
            {/*{handle?.isPrimary && (*/}
            {/*  <Box*/}
            {/*    bgColor="warning.750"*/}
            {/*    p={2}*/}
            {/*    rounded="lg"*/}
            {/*    display="flex"*/}
            {/*    gap={2}*/}
            {/*    alignItems="center"*/}
            {/*    alignSelf={['inherit', 'flex-end']}*/}
            {/*  >*/}
            {/*    <Text fontSize={['sm', 'md']} color="button.500">*/}
            {/*      Your primary Handles*/}
            {/*    </Text>*/}
            {/*    <Icon color="button.500" w={6} h={6} as={FlagIconFilled} />*/}
            {/*  </Box>*/}
            {/*)}*/}
            <Button
              alignSelf={['inherit', 'flex-end']}
              variant="ghosted"
              color="grey.100"
              bgColor={isLowerThanMobile ? 'transparent' : undefined}
              fontWeight="normal"
              fontSize={['sm', 'sm']}
              h={9}
              rightIcon={<ExploreIcon />}
              onClick={() =>
                window.open(
                  `${explorerUrl}/account/${domain}${ExplorerTypes.ASSETS}`
                )
              }
            >
              Explorer
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {shortBio?.value && (
        <Flex>
          <Box>
            <Text fontSize={['sm', 'sm']} fontWeight="400" color="grey.100">
              {shortBio?.value}
            </Text>
          </Box>
        </Flex>
      )}
    </Card>
  );
};
