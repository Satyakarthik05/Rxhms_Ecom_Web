import { CategoryFilter } from "../../inventoryProduct/model/categoryFilter";
import { PaginatedResponse } from "../../inventoryProduct/model/paginatedResponse";
import { ProductCard } from "../../inventoryProduct/model/productCard";

export interface SearchResponse {
  categories: CategoryFilter[];
  products: PaginatedResponse<ProductCard>;
  minPrice: number;
  maxPrice: number;
}
