import { useMediaQuery } from '@chakra-ui/react';

const useScreenSize = () => {
  const [isMobile] = useMediaQuery('(max-width: 62em)');
  const [isLargerThan600] = useMediaQuery('(min-height: 600px)');
  const [isLargerThan660] = useMediaQuery('(min-height: 660px)');
  const [isLargerThan768] = useMediaQuery('(min-height: 768px)');
  const [isLargerThan900] = useMediaQuery('(min-height: 900px)');
  const [isLessThan820] = useMediaQuery('(max-height: 819px)');

  return {
    isMobile,
    isLargerThan600,
    isLargerThan660,
    isLargerThan768,
    isLargerThan900,
    isLessThan820,
  };
};

export { useScreenSize };
