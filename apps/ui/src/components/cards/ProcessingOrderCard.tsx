import { Image, Flex, Text } from '@chakra-ui/react';
import { parseURI } from '@/utils/formatter';
import { useState, useEffect } from 'react';

interface ProcessingOrderCardProps {
  image: string;
}

const loopingText = [
  'Preparing your asset',
  'Locking in your price',
  'Securing blockchain',
  'Listing your NFT',
];

// Animated dots component
const AnimatedDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '..') return '';
        return `${prev}.`;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text color="section.500" minW="17px">
      .{dots}
    </Text>
  );
};

export const ProcessingOrderCard = ({ image }: ProcessingOrderCardProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loopingText.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex
      w="full"
      maxW="185px"
      h="259px"
      rounded="lg"
      bg="grey.500"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Image
        src={parseURI(image)}
        alt="Processing NFT"
        objectFit="cover"
        borderTopRadius="8px"
        aspectRatio="1/1"
        opacity="30%"
        w="185px"
        h="189px"
        animation="pulse 2s ease-in-out infinite"
        sx={{
          '@keyframes pulse': {
            '0%': { opacity: '0.3' },
            '50%': { opacity: '0.5' },
            '100%': { opacity: '0.3' },
          },
        }}
      />

      <Flex alignItems="center" justifyContent="center" w="full" h="full">
        <Text color="section.500" fontSize="xs" display="flex">
          {loopingText[currentTextIndex]}
          <AnimatedDots />
        </Text>
      </Flex>
    </Flex>
  );
};
