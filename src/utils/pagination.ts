export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const parsePagination = (options: PaginationOptions = {}): PaginationResult => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const skip = (page - 1) * limit;
  
  return {
    skip,
    take: limit,
    page,
    limit
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  pagination: PaginationResult
): PaginatedResponse<T> => {
  return {
    data,
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages: Math.ceil(total / pagination.limit)
  };
};