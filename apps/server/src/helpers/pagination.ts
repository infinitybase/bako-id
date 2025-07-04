type PaginationProps<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

export type PaginationResult<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const getPagination = <T>({
  data,
  limit,
  page,
  total,
}: PaginationProps<T>): PaginationResult<T> => {
  const hasNextPage = page * limit < total;
  const totalPages = Math.ceil(total / limit);
  const hasPreviousPage = page > 1;

  return {
    data,
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
