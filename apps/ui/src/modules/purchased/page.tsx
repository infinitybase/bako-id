import {
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
import { useNavigate } from '@tanstack/react-router';
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
import { TransactionDomainDetailsModal } from '../../components/modal/transactionDetails';
import { useScreenSize } from '../../hooks/useScreenSize';
import { calculatePeriodYears } from '../../utils/calculator';
import { useProvider, useWallet } from '@fuels/react';
import { getExplorer } from '../../utils/getExplorer';
import { useGetGracePeriod } from '../../hooks/useGetGracePeriod';

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
  const navigate = useNavigate();

  const { provider } = useProvider();
  const explorerUrl = getExplorer(provider?.getChainId());

  const year = calculatePeriodYears(dates?.timestamp, dates?.gracePeriod);

  const mainOperation = transaction.operations.find(
    (op) => op.assetsSent && op.from?.address === wallet?.address.toB256(),
  );

  const totalAmountPaidForNFT =
    mainOperation?.assetsSent?.map((item) => bn(item.amount))[0] ?? bn(0);

  const sumTotalAmountAndTxFee = transaction?.fee
    ?.add(totalAmountPaidForNFT)
    .format();

  const navigateToMyHandle = () => {
    navigate({
      to: `/profile/${domain.replace('@', '')}`,
    });
  };

  return (
    <Box
      w="full"
      h="full"
      display="flex"
      alignItems="center"
      mt={[12, 6, 0, 0]}
      gap={[12, 5, 5, 5]}
      mb={[0, 0, 'auto', 0]}
      flexDirection="column"
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
              Now you are the owner of this Handles.
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
              url={window.location.origin}
              // url={'https://youtube.com'}
              title={`I just minted my own ${window.location.pathname.replace('/buy/%40', '@')} Handle on`}
              hashtags={['web3', 'bakoid', 'fuelnetwork']}
              related={[]}
            >
              <TwitterIcon w={4} h={4} mr={2} />
              Share on X
            </TwitterShareButton>
          </Button>
        </Stack>
        <Button
          variant="secondary"
          borderColor="grey.100"
          color="grey.100"
          onClick={navigateToMyHandle}
        >
          Go to my Handle
        </Button>
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
