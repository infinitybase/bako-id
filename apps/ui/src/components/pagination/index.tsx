import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

interface PaginationProps {
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export const Pagination = ({
  page = 1,
  totalPages = 1,
  hasNextPage = false,
  hasPreviousPage = false,
}: PaginationProps) => {
  return (
    <>
      <Text fontSize="sm" mr={2}>
        {page} - {totalPages} of {totalPages}
      </Text>
      <IconButton
        aria-label="Previous Page"
        variant="unstyled"
        disabled={!hasPreviousPage}
        size="sm"
      >
        <Link search={{ page: page - 1 }} to="." disabled={!hasPreviousPage}>
          <ChevronLeftIcon fontSize="2xl" />
        </Link>
      </IconButton>
      <IconButton
        aria-label="Next Page"
        variant="unstyled"
        disabled={!hasNextPage}
        size="sm"
      >
        <Link search={{ page: page + 1 }} to="." disabled={!hasNextPage}>
          <ChevronRightIcon fontSize="2xl" />
        </Link>
      </IconButton>
    </>
  );
};
