import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";

const defaultTheme = extendTheme({
  initialColorMode: "dark",
  colors,
});

export { defaultTheme };
