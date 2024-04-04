import { Box } from '@chakra-ui/react';
import { generateColor } from '../../utils/generateColor.ts';

export const RoundedUserIcon = ({
  width,
  heigth,
}: { width: string; heigth: string }) => {
  const topColor = generateColor();
  const botColor = generateColor();

  return (
    <Box
      rounded={50}
      w={width}
      h={heigth}
      bgGradient={`linear(to-br, ${topColor}, ${botColor})`}
    />
  );
};
