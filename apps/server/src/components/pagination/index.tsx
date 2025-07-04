import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton, Text } from '@chakra-ui/react';

interface PaginationProps {
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export const Pagination = ({
  page = 1,
  totalPages = 1,
  hasNextPage = false,
  hasPreviousPage = false,
  onPageChange,
  isFetching,
}: PaginationProps) => {
  return (
    <>
      <Text fontSize="sm" mr={2}>
        {page} - {totalPages} of {totalPages}
      </Text>
      <IconButton
        aria-label="Previous Page"
        variant="unstyled"
        disabled={!hasPreviousPage || isFetching}
        size="sm"
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon fontSize="2xl" />
      </IconButton>
      <IconButton
        aria-label="Next Page"
        variant="unstyled"
        disabled={!hasNextPage || isFetching}
        size="sm"
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon fontSize="2xl" />
      </IconButton>
    </>
  );
};
