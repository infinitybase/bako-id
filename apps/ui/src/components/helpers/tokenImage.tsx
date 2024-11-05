import {
  Image as ChakraImage,
  Flex,
  type ImageProps,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';

interface TokenImageProps extends ImageProps {
  src: string;
}

export const TokenImage = ({ src, ...props }: TokenImageProps) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(true);

  return (
    <Flex justifyContent="center" alignItems="center" position="relative">
      {isGeneratingImage && (
        <Spinner boxSize="100px" mx="auto" position="absolute" />
      )}
      <ChakraImage
        onLoad={() => setIsGeneratingImage(false)}
        sx={{ display: isGeneratingImage ? 'none' : 'block' }}
        src={src}
        w={['17rem', '50%', '50%', '55%']}
        h="fit"
        {...props}
      />
    </Flex>
  );
};
