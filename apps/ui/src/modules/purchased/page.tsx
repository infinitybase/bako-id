import { InfoIcon } from '@/components/icons/infoIcon';
import { TransactionDomainDetailsModal } from '@/components/modal/transactionDetails';
import { calculatePeriodYears } from '@/utils/calculator';
import {
  Alert,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { bn, type TransactionResult } from 'fuels';
import { TwitterShareButton } from 'react-share';
import {
  CheckoutCard,
  // FarcasterIcon,
  GoBack,
  TwitterIcon,
} from '../../components';
import { TransactionsDetailsButton } from '../../components/buttons/transactionsDetailsButton';
import { ViewOnExplorerButton } from '../../components/buttons/viewOnExploreButton';
import { useChainId } from '../../hooks/useChainId';
import { useGetGracePeriod } from '../../hooks/useGetGracePeriod';
import { useScreenSize } from '../../hooks/useScreenSize';
import { getExplorer } from '../../utils/getExplorer';

interface IPurchased {
  domain: string;
  transactionId: string;
  transaction: TransactionResult;
}

export const Purchased = ({
  domain,
  transactionId,
  transaction,
}: IPurchased) => {
  const { dates } = useGetGracePeriod(domain.replace('@', ''));
  const { wallet } = useWallet();
  const modal = useDisclosure();
  const { isMobile } = useScreenSize();

  const { chainId } = useChainId();
  const explorerUrl = getExplorer(chainId);

  const year = calculatePeriodYears(dates?.timestamp, dates?.gracePeriod);

  const mainOperation = transaction.operations.find(
    (op) => op.assetsSent && op.from?.address === wallet?.address.toB256()
  );

  const totalAmountPaidForNFT =
    mainOperation?.assetsSent?.map((item) => bn(item.amount))[0] ?? bn(0);

  const sumTotalAmountAndTxFee = transaction?.fee
    ?.add(totalAmountPaidForNFT)
    .format();

  // const navigateToMyHandle = () => {
  //   navigate({
  //     to: `/profile/${domain.replace('@', '')}`,
  //   });
  // };

  return (
    <Box
      w="full"
      display="flex"
      alignItems="center"
      mt={[12, 6, 0, 0]}
      gap={[12, 5, 5, 5]}
      mb={[0, 0, 'auto', 0]}
      flexDirection="column"
      h="80vh"
      overflowY="scroll"
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none',
          width: '6px',
          maxHeight: '330px',
          backgroundColor: 'grey.900',
          borderRadius: '30px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'button.500',
          borderRadius: '30px',
          height: '10px',
        },
      }}
    >
      {!isMobile && <GoBack />}
      <Card
        border="1px solid"
        borderColor="stroke.500"
        backdropFilter="blur(5px)"
        p={6}
        w={['95%', 'lg', 'lg', 'lg']}
        h={['80%', 'xl']}
        alignSelf="center"
        display="flex"
        flexDir="column"
        minH={630}
      >
        <CardHeader>
          <Box
            display="flex"
            flexDir="column"
            gap={2}
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <Heading className="bg-pan-tl" bgClip="text" fontWeight={700}>
              Congratulations
            </Heading>
            <Text color="section.200" fontSize={['sm', 'md']}>
              Now you are the owner of this Handle.
            </Text>
          </Box>
        </CardHeader>

        <CardBody
          w="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CheckoutCard />
        </CardBody>

        <HStack justify="space-between">
          <TransactionsDetailsButton onClick={modal.onOpen} />
          <ViewOnExplorerButton
            onClick={() =>
              window.open(`${explorerUrl}/tx/${transactionId}`, '_blank')
            }
          />
        </HStack>
        <Stack
          direction={['column', 'row', 'row', 'row']}
          my={['1rem', '.8rem']}
          gap={4}
        >
          {/* <Button
            variant="primary"
            leftIcon={<FarcasterIcon w={4} h={4} />}
            // onClick={() => setFormStep(LIST_DOMAINS)}
          >
            Share on Farcaster
          </Button> */}

          <Button variant="primary" px={1}>
            <TwitterShareButton
              style={{
                width: '100%',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              url={`https://bako.id/${domain}`}
              title={'I just minted my own Handle on'}
              related={[]}
            >
              <TwitterIcon w={4} h={4} mr={2} />
              Share on X
            </TwitterShareButton>
          </Button>
        </Stack>
        <Alert
          rounded="lg"
          variant="solid"
          bg="info.900"
          fontSize="xs"
          gap={2}
          p={2}
          color="info.200"
          borderColor="info.950"
          borderWidth="1px"
          lineHeight="shorter"
        >
          <InfoIcon fontSize="xl" />
          After purchase, the transaction may take 1–2 minutes to process.
          Refresh the page afterward to see your Handle...
        </Alert>
        {/* <Button
          variant="secondary"
          borderColor="grey.100"
          color="grey.100"
          onClick={navigateToMyHandle}
        >
          Go to my Handle
        </Button> */}
      </Card>
      <TransactionDomainDetailsModal
        modalTitle="Transaction Details"
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        domain={domain}
        period={year}
        cost={sumTotalAmountAndTxFee}
      />
    </Box>
  );
};
