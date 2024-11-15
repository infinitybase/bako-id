import { Suspense } from 'react';
import { Card } from '../../../components/card';
import {
  Button,
  CardBody,
  CardHeader,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { NSDialog } from './dialog';

export const NSCard = () => {
  const ensDialogState = useDisclosure();

  return (
    <>
      <NSDialog
        isOpen={ensDialogState.isOpen}
        onClose={ensDialogState.onClose}
      />
      <Suspense>
        <Card
          backdropFilter="blur(7px)"
          h="fit-content"
          maxW={['full', '45rem']}
        >
          <CardHeader w="full">
            <Heading fontSize="lg" color="grey.100">
              Import Data from ENS
            </Heading>
          </CardHeader>
          <CardBody
            mt={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={8}
          >
            <Text fontSize="xs" color="grey.200" lineHeight="12.1px">
              Importing data will replace your connected social media accounts
              and update your nickname to match the imported account.
            </Text>
            <Button
              variant="primary"
              maxW="112px"
              onClick={ensDialogState.onOpen}
            >
              Import
            </Button>
          </CardBody>
        </Card>
      </Suspense>
    </>
  );
};
