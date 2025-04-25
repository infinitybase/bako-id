import {
  Box,
  Flex,
  Icon,
  Image,
  Spinner,
  type BoxProps,
  type FlexProps,
} from '@chakra-ui/react';
import { AvatarIcon, EditIcon } from '../icons';
import { useEffect, useState } from 'react';

interface UserAvatarProps {
  avatar?: string | null;
  onClick?: () => void;
  isAvatarLoading: boolean;
  isEditProfilePicModalOpen?: boolean;
}

interface EditProfilePicAvatarProps extends Partial<UserAvatarProps> {
  setNoAvatarFromUrl: (noAvatarFromUrl: boolean) => void;
  noAvatarFromUrl: boolean;
}

interface AvatarContainerProps {
  size?: 'small' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  showBorder?: boolean;
}

const AvatarContainer = ({
  size = 'large',
  children,
  onClick,
  isLoading,
  showBorder = true,
}: AvatarContainerProps) => {
  const isSmall = size === 'small';
  const containerProps: BoxProps = {
    w: isSmall ? [14, 14, 20] : 40,
    h: isSmall ? [14, 14, 20] : 32,
    rounded: 'lg',
    border: showBorder ? '1.5px solid' : 'none',
    borderColor: showBorder ? 'button.500' : 'transparent',
    overflow: 'hidden',
    ...(isSmall && { mr: '1.1rem' }),
    ...(!isSmall && { mr: 4 }),
    ...(onClick && { cursor: 'pointer' }),
  };

  if (isLoading) {
    const flexProps: FlexProps = {
      ...containerProps,
      alignItems: 'center',
      justifyContent: 'center',
    };
    return (
      <Flex {...flexProps}>
        <Spinner w={6} h={6} />
      </Flex>
    );
  }

  return (
    <Box {...containerProps} onClick={onClick}>
      {children}
    </Box>
  );
};

const AvatarGradientBox = () => {
  return (
    <Box
      position="absolute"
      left={0}
      bottom={0}
      w="full"
      h="full"
      rounded="lg"
      background="linear-gradient(
        to top,
        rgba(0, 0, 0, 0.9) 0%,
        rgba(0, 0, 0, 0.85) 15%,
        rgba(0, 0, 0, 0.75) 25%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0.1) 100%
      )"
    />
  );
};

const EditProfilePicButton = () => (
  <Flex
    alignItems="center"
    position="absolute"
    left={3}
    bottom={1}
    w="fit-content"
    color="grey.100"
    fontSize={{ base: '10px', md: 'sm' }}
  >
    <EditIcon w={{ base: 3, md: 6 }} h={{ base: 3, md: 6 }} />
    Edit
  </Flex>
);

const EditProfilePicAvatar = ({
  avatar,
  isAvatarLoading,
  onClick,
  setNoAvatarFromUrl,
  noAvatarFromUrl,
}: EditProfilePicAvatarProps) => {
  return (
    <Flex>
      {avatar && !noAvatarFromUrl ? (
        <AvatarContainer
          size="small"
          onClick={onClick}
          isLoading={isAvatarLoading}
        >
          <Box position="relative" w="full" h="full">
            <Image
              src={avatar}
              referrerPolicy="no-referrer"
              fetchPriority="high"
              alt="Profile avatar"
              w="full"
              h="full"
              objectFit="cover"
              onError={() => setNoAvatarFromUrl(true)}
              onLoad={() => noAvatarFromUrl && setNoAvatarFromUrl(false)}
              rounded="lg"
            />
            <AvatarGradientBox />
            <EditProfilePicButton />
          </Box>
        </AvatarContainer>
      ) : (
        <AvatarContainer
          size="small"
          onClick={onClick}
          isLoading={isAvatarLoading}
          showBorder={isAvatarLoading}
        >
          <Box position="relative" w="full" h="full">
            <AvatarGradientBox />
            <Icon w="full" h="full" as={AvatarIcon} />
            <EditProfilePicButton />
          </Box>
        </AvatarContainer>
      )}
    </Flex>
  );
};

const ProfileAvatar = ({
  avatar,
  isAvatarLoading,
  noAvatarFromUrl,
  setNoAvatarFromUrl,
}: EditProfilePicAvatarProps) => {
  const hasAvatar = avatar && !noAvatarFromUrl;
  return (
    <AvatarContainer
      size="large"
      isLoading={isAvatarLoading}
      showBorder={hasAvatar ? true : isAvatarLoading}
    >
      {avatar && !noAvatarFromUrl ? (
        <Image
          src={avatar}
          referrerPolicy="no-referrer"
          fetchPriority="high"
          alt="Profile avatar"
          w="full"
          h="full"
          objectFit="cover"
          onError={() => setNoAvatarFromUrl(true)}
          onLoad={() => setNoAvatarFromUrl(false)}
          rounded="lg"
        />
      ) : (
        <Icon w="full" h="full" as={AvatarIcon} />
      )}
    </AvatarContainer>
  );
};

export const UserAvatar = ({
  avatar,
  onClick,
  isAvatarLoading,
  isEditProfilePicModalOpen,
}: UserAvatarProps) => {
  const [noAvatarFromUrl, setNoAvatarFromUrl] = useState(false);

  useEffect(() => {
    if (avatar) {
      setNoAvatarFromUrl(false);
    }
  }, [avatar]);

  return isEditProfilePicModalOpen ? (
    <EditProfilePicAvatar
      noAvatarFromUrl={noAvatarFromUrl}
      setNoAvatarFromUrl={setNoAvatarFromUrl}
      avatar={avatar}
      isAvatarLoading={isAvatarLoading}
      onClick={onClick}
    />
  ) : (
    <ProfileAvatar
      avatar={avatar}
      isAvatarLoading={isAvatarLoading}
      noAvatarFromUrl={noAvatarFromUrl}
      setNoAvatarFromUrl={setNoAvatarFromUrl}
    />
  );
};
