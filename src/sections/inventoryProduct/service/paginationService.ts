import { BeseAxios } from "../../../web-constants/constants";
import { PaginatedResponse } from "../model/paginatedResponse";
import { ProductCard } from "../model/productCard";

export const ShopAllPaginationUri = "/inventory/product/pages/get/active-product-cards";

export const getPaginationProducts = async (
    offset: number,
    pageSize: number
  ): Promise<PaginatedResponse<ProductCard>> => {
    try {
      const response:any = await BeseAxios.get(ShopAllPaginationUri, {
        params: { offset, pageSize },
      });
      console.log("PaginationProducts:", response.data.content);

      return response.data.content;
    } catch (error) {
      console.error("Error fetching paginated products:", error);
      throw error;
    }
  };