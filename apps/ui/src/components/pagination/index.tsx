import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton, Text } from '@chakra-ui/react';

interface PaginationProps {
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  accountOrders?: boolean;
}

export const Pagination = ({
  page = 1,
  totalPages = 1,
  hasNextPage = false,
  hasPreviousPage = false,
  isLoading = false,
  onPageChange,
  accountOrders = false,
}: PaginationProps) => {
  const newPage = accountOrders ? 0 : page;

  return (
    <>
      <Text fontSize="sm" mr={2}>
        {page === 0 ? 1 : page + 1} - {totalPages} of {totalPages}
      </Text>
      <IconButton
        aria-label="Previous Page"
        variant="unstyled"
        disabled={!hasPreviousPage || isLoading}
        onClick={() => onPageChange(page - 1)}
        size="sm"
      >
        <ChevronLeftIcon fontSize="2xl" />
      </IconButton>
      <IconButton
        aria-label="Next Page"
        variant="unstyled"
        disabled={!hasNextPage || isLoading}
        size="sm"
        onClick={() => onPageChange(newPage + 1)}
      >
        <ChevronRightIcon fontSize="2xl" />
      </IconButton>
    </>
  );
};
