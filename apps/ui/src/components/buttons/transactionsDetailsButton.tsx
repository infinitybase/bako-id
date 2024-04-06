import { Button } from '@chakra-ui/react';
import { VerticalOptionsIcon } from '../icons/verticalOptions';

interface ITransactionsDetailsButton {
  onClick: () => void;
}

export const TransactionsDetailsButton = ({
  onClick,
}: ITransactionsDetailsButton) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="xs"
      color="white"
      fontWeight="normal"
      leftIcon={<VerticalOptionsIcon w={4} h={4} />}
      _hover={{
        bgColor: 'transparent',
        color: 'button.500',
      }}
    >
      View transactions details
    </Button>
  );
};
