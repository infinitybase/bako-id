import { GoBack } from '../components/helpers';
import { Box, Button, Center, Divider, Text, VStack } from '@chakra-ui/react';
import { ProfileComponents } from '../components/profile';
import { formatAddress, formatDate } from '../utils/formatter.ts';
import { CopyIcon } from '@chakra-ui/icons';
import { ReactElement, useState } from 'react';

export const User = () => {
  const [currentTab, setCurrentTab] = useState('profile')

  const tabs: Record<string, ReactElement | null> = {
    profile: <Profile />,
    records: null,
    Ownership: null,
    Subnames: null,
    Permissions: null,
    More: null
  }

  const handleChangeTab = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const selected = e.currentTarget.id.toLowerCase()

    setCurrentTab(selected)
  }

  return (
    <Center w="full" h="full" display="flex" flexDir="column" py={2} px={{ base: 4, md: 20, xl: 40 }} zIndex={10}>
      <GoBack />
      <Center w="full" h="full" pt={14}>
        <VStack w="full" h="full" maxW="42rem" gap={3}>
          <ProfileComponents.Header current={currentTab} onClick={handleChangeTab} />
          <ProfileComponents.Hero />
          {tabs[currentTab]}
        </VStack>
      </Center>
    </Center>
  )
}

// @TODO: rethink this in a better approach to separate the components

const Profile = () => {
  const address = "fuel1yuxap2tnlt4nmr64k6ujlhlqpm9rf8ye5uknqkf30wzwugp0q8wq2fps52"

  return <ProfileComponents.Data>
    <Address address={address} />
    <Ownership owner={address} expiry="2024-03-31" parent="eth" />
    <Divider w="full" bg="grey.200" />
    <Button>Action</Button>
  </ProfileComponents.Data>
}

const Address = ({ address }: { address: string }) => {
  return<Box display="flex" flexDir="column" gap={2}>
    <Text fontSize='sm' fontWeight={600} color="button.200">Address</Text>
    <ProfileComponents.InfoButton _hover={{ transform: 'translate(0px, -3px)' }}>
      <Text color="background.600" fontSize="sm" fontWeight={500}>
        {formatAddress(address)}
      </Text>
      <CopyIcon />
    </ProfileComponents.InfoButton>
  </Box>
}

// @TODO: What's the definition for the redirect, when a user click in one of this information?
interface OwerneshipProps {
  owner: string,
  expiry: string,
  parent: string
}

const Ownership = ({ owner, expiry, parent }: OwerneshipProps) => {
  return <Box display="flex" flexDir="column" gap={2} >
    <Text fontSize='sm' fontWeight={600} color="button.200">Ownership</Text>
    <Box display="flex" gap={2} flexWrap="wrap">
      <ProfileComponents.InfoButton _hover={{ transform: 'translate(0px, -3px)' }}>
        <Text fontSize='sm' fontWeight={400} color="grey.200">owner</Text>
        <Text color="background.600" fontSize="sm" fontWeight={500}>
          {formatAddress(owner)}
        </Text>
        <CopyIcon />
      </ProfileComponents.InfoButton>
      <ProfileComponents.InfoButton _hover={{ transform: 'translate(0px, -3px)' }}>
        <Text fontSize='sm' fontWeight={400} color="grey.200">expiry</Text>
        <Text color="background.600" fontSize="sm" fontWeight={500}>
          {formatDate(expiry)}
        </Text>
        <CopyIcon />
      </ProfileComponents.InfoButton>
      <ProfileComponents.InfoButton _hover={{ transform: 'translate(0px, -3px)' }}>
        <Text fontSize='sm' fontWeight={400} color="grey.200">parent</Text>
        <Text color="background.600" fontSize="sm" fontWeight={500}>
          {parent}
        </Text>
        <CopyIcon />
      </ProfileComponents.InfoButton>
    </Box>
  </Box>
}
