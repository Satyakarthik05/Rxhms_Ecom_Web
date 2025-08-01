import { BeseAxios } from "../../../web-constants/constants";
import { SearchRequest } from "../../Searchbar/model/searchRequest";
import { GET_PRODUCT_BY_SECTION_PAGES } from "./service";

export const getDataWithSectionSlugService = async (
  slug: string,
  pageCount: number,
  categorySlugs?: string[] | null,
  minPrice?: number | null,
  maxPrice?: number | null
) => {
  try {
    const searchRequest: SearchRequest = {
      searchKey: slug,
      categorySlugs: categorySlugs,
      minPrice: minPrice,
      maxPrice: maxPrice,
      offset: pageCount,
      pageSize: 9,
    };
    console.log("BeforeServe #LOG", searchRequest);
    const response: any = await BeseAxios.post(
      GET_PRODUCT_BY_SECTION_PAGES,
      searchRequest
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
