import { Connect } from '../helpers';
import { Center, Image } from '@chakra-ui/react';

export const Header = () => {
  return (
    <Center as="header" w="full" display="flex" justifyContent="space-between" alignItems="center" py={2} px={{ base: 0, md: 20, xl: 40 }} className="transition-all-05">
      <Image src="/bakoID-logo.svg" width={190} height={75} alt="Bako logo" />
      <Connect />
    </Center>
  )
}
