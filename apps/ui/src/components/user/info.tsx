import { Box, Text } from '@chakra-ui/react';
import { AbstractAddress } from 'fuels';
import { formatAddress } from '../../utils/formatter.ts';
import { useNavigate } from '@tanstack/react-router';

export const Info = ({ name, account }: { name: string, account: string | AbstractAddress }) => {

  const navigate = useNavigate()
  // const copy = () => {
  //   navigator.clipboard.writeText(account.toString())
  // }

  const navigateProfile = () => {
    navigate({ to: `/user/${name}` })
  }

  return (
    <Box
      display="flex"
      minH="2.5rem"
      rounded={60}
      bgColor="background.400"
      p={2}
      pl={5}
      position="relative"
      border={1}
      borderStyle="solid"
      borderColor="grey.400"
      as="button"
      onClick={navigateProfile}
    >
      <Text color="text.700" pr="2.6rem">{formatAddress(account.toString())}</Text>
      <Box
        position="absolute"
        right={-0.5}
        top={-0.5}
        rounded="50%"
        bg="grey.500"
        w="2.8rem"
        h="2.8rem"
        border={1}
        borderStyle="solid"
        borderColor="grey.200"
        className="transition-all-05"
      ></Box>
    </Box>
  )
}
