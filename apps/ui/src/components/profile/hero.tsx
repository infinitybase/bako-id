import { Box, Button, Text } from '@chakra-ui/react';

export const Hero = () => {
  return(
    <Box position="relative" rounded={8} w="full" minH="fit-content" h={{ base: '14rem', sm: '12rem' }} overflow="hidden">
      <Box w="full" h={{ base: '50%', sm: '55%' }} bgGradient="linear(to-br, #FFC010, #B24F18)"></Box>
      <Box position="absolute" bottom={{ base: 14, sm: 7 }} left={7} rounded="50%" bg="background.600" w="7rem" h="7rem" className="transition-all-05"></Box>
      <Box
        display="flex"
        minH="fit-content"
        h={{ base: '50%', sm: '55%' }}
        alignItems="center"
        justifyContent="space-between"
        p={4}
        pl={{ base: 4, sm: '10rem' }}
        pt={{ base: '4rem', sm: 4 }}
        bg="white"
        className="transition-all-05"
      >
        <Text fontSize="xl" color="background.600" fontWeight={600}>@myusername</Text>
        <Button
          variant="outline"
          borderColor="background.600"
          color="background.600"
          _hover={{}} _focus={{}} _active={{}}
          fontSize="sm"
        >Extend</Button>
      </Box>
    </Box>
  )
}
