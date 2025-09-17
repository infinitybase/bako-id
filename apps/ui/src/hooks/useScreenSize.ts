import { useMediaQuery } from '@chakra-ui/react';

const useScreenSize = () => {
  const [isMobile] = useMediaQuery('(max-width: 62em)');
  const [isSmallMobile] = useMediaQuery(
    '(min-width: 320px) and (max-width: 420px)'
  );
  const [isLargerThan600] = useMediaQuery('(min-height: 600px)');
  const [isLargerThan660] = useMediaQuery('(min-height: 660px)');
  const [isLargerThan768] = useMediaQuery('(min-height: 768px)');
  const [isLargerThan900] = useMediaQuery('(min-height: 900px)');

  return {
    isMobile,
    isSmallMobile,
    isLargerThan600,
    isLargerThan660,
    isLargerThan768,
    isLargerThan900,
  };
};

export { useScreenSize };
