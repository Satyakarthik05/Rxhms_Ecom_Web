export interface SearchRequest {
  searchKey?: string | null;
  categorySlugs?: string[] | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  offset?: number;
  pageSize?: number | null;
}
