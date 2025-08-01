import {
  Box,
  Container as ContainerChakra,
  useMediaQuery,
  type ContainerProps as ContainerChakraProps,
} from '@chakra-ui/react';

import BackgroundTexture from '../../assets/bg-texture.svg';
import MobileBackgroundTexture from '../../assets/mobile-background-texture.svg';

export interface ContainerProps extends ContainerChakraProps {}

const Container = ({ children, ...props }: ContainerProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48em)');
  return (
    <ContainerChakra
      maxWidth="full"
      bgColor="background.500"
      h="100vh"
      display="flex"
      flexDirection="column"
      p={0}
      {...props}
    >
      <Box
        backgroundImage={
          props.backgroundImage
            ? props.backgroundImage
            : isMobile
              ? MobileBackgroundTexture
              : BackgroundTexture
        }
        backgroundSize={'cover'}
        backgroundRepeat={'no-repeat'}
        backgroundPosition="center"
        h="full"
        maxH="full"
        overflow="hidden"
      >
        {children}
      </Box>
    </ContainerChakra>
  );
};

export { Container };
