import { Connect } from '../helpers';
import { Box, Center, Image, Skeleton } from '@chakra-ui/react';
import { useIsConnected } from '@fuels/react';
import { Info } from '../user';
import { useFuelConnect } from '../../hooks';

export const Header = () => {
  const { wallet } = useFuelConnect()
  const { isFetching } = useIsConnected()

  console.debug(isFetching)
  console.debug(wallet)
  const account = () => {
    if(isFetching && wallet === undefined) {
      return <Skeleton height="2.5rem" w="7rem" rounded={8} />
    }
    if(wallet) {
      return <Info name="user" account={wallet.address} />
    }
    if(!isFetching && wallet === null) return <Box><Connect /></Box>
  }

  return (
    <Center as="header" w="full" display="flex" justifyContent="space-between" alignItems="center" py={2} px={{ base: 0, md: 20, xl: 40 }} className="transition-all-05">
      <Image src="/bakoID-logo.svg" width={190} height={75} alt="Bako logo" />
      {account()}
    </Center>
  )
}
