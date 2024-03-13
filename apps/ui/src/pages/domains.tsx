import { DomainCard, GoBack } from '../components/helpers';
import { Center, useToast } from '@chakra-ui/react';

export const Domains = () => {
  const domains = [{
    name: 'test',
    resolver: 'fdsljaf',
    owner: 'slakdjfasdl'
  }]
  const toast = useToast()

  return (
    <Center w="full" h="full" display="flex" flexDir="column" py={2} px={{ base: 4, md: 20, xl: 40 }} zIndex={10}>
      <GoBack />
      <Center w="full" h="full" display="flex" flexDir="column">
        {domains.map(data => {
          const copy = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if(!data?.owner) return

            toast({
              title: 'Copied',
              status: 'success',
              duration: 1000,
              isClosable: true,
            })

            if(e.currentTarget.id === "resolver") {
              navigator.clipboard.writeText(data.resolver);
              return
            }
            navigator.clipboard.writeText(data.owner);
          }
          return (
            <DomainCard domain={data} isList copy={copy} />
          )
        })}
      </Center>
    </Center>
  )
}
