export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parsePagination(
  pageQuery?: unknown,
  limitQuery?: unknown,
  defaultLimit = 20,
  maxLimit = 100
): PaginationParams {
  const page = Math.max(1, parseInt(String(pageQuery ?? '1'), 10) || 1);
  const rawLimit = parseInt(String(limitQuery ?? defaultLimit), 10) || defaultLimit;
  const limit = Math.min(maxLimit, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function paginate<T>(
  items: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return {
    items,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit) || 1,
    },
  };
}
