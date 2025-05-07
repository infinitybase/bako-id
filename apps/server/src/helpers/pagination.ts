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
  // if page = 3 and totalPages = 2 => hasPreviousPage = false but is true because has page 2
  const hasPreviousPage = totalPages > 1 ? page > 1 : false;

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
