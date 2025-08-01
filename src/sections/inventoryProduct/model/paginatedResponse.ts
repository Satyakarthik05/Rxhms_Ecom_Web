export interface PaginatedResponse<T> {
  records: T[];
  totalPages: number;
  totalElements: number;
}
