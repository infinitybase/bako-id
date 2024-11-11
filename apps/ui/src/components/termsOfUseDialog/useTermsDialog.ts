import { useScreenSize, useVerifyBrowserType } from '../../hooks';

const useTermsDialog = () => {
  const { isLargerThan600, isLargerThan660, isLargerThan768, isLargerThan900 } =
    useScreenSize();
  const { isMobile, isSafariBrowser } = useVerifyBrowserType();

  const textHeight = () => {
    if (isMobile) {
      if (isLargerThan900) return 600;
      if (isLargerThan768) return 550;
      if (isLargerThan660) return 430;
      if (isLargerThan600) return 300;
      return 200;
    }
    return 420;
  };
  const hideCloseButton = isSafariBrowser && isMobile;

  return {
    textHeight,
    hideCloseButton,
  };
};

export { useTermsDialog };
