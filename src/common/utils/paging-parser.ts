import { Paging } from "../interface/pagination.interface";

export const pagingParser = (query, total: number, rowLength: number): Paging => {
  return {
    total,
    currentPageTotal: rowLength,
    currentPageNo: query.page,
    limit: query.limit,
    totalNoPages: Math.ceil(total / query.limit)
  };
}
