import {
  Image as ChakraImage,
  Flex,
  type ImageProps,
  ResponsiveValue,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';

interface TokenImageProps extends ImageProps {
  src: string;
  spinnerSize?: string;
  spinnerTopPosition?: ResponsiveValue<number | string>;
}

export const TokenImage = ({ src, ...props }: TokenImageProps) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(true);

  return (
    <Flex justifyContent="center" alignItems="center" position="relative">
      {isGeneratingImage && (
        <Spinner
          boxSize={props.spinnerSize ?? '100px'}
          mx="auto"
          left={props.spinnerSize ? 12 : 'unset'}
          top={props.spinnerTopPosition}
          position="absolute"
        />
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
