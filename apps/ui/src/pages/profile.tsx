import { GoBack } from '../components/helpers';
import { Center, VStack } from '@chakra-ui/react';
import { ProfileComponents } from '../components/profile';

export const Profile = () => {
  return (
    <Center w="full" h="full" display="flex" flexDir="column" py={2} px={{ base: 4, md: 20, xl: 40 }} zIndex={10}>
      <GoBack />
      <Center w="full" h="full" pt={14}>
        <VStack w="full" h="full" maxW="18rem">
          <ProfileComponents.Header current="Profile" onClick={() => {}} />
        </VStack>
      </Center>
    </Center>
  )
}
