import { Tooltip, TooltipProps } from '@chakra-ui/react';

interface BakoTooltipProps extends TooltipProps {
  children: React.ReactNode;
}

export const BakoTooltip = ({ children, ...props }: BakoTooltipProps) => {
  return (
    <Tooltip
      hasArrow
      placement="top"
      label="Coming Soon"
      rounded="lg"
      p={2}
      px={4}
      fontSize="sm"
      bgColor="grey.600"
      closeDelay={300}
      {...props}
    >
      {children}
    </Tooltip>
  );
};
