import { BeseAxios } from "../../../web-constants/constants";
import { MegaSearchUri } from "../../myCart/service/myCartService";
import { SearchRequest } from "../../Searchbar/model/searchRequest";
import { FILTERED_PRODUCTS } from "./service";

export {};
export const getFilteredDataService = async (
  categoryIds: string[],
  minPrice: number,
  maxPrice: number,
  searchTerm: string
) => {
  console.log(
    "in service beforeServiceCall =>",
    categoryIds,
    minPrice,
    maxPrice,
    searchTerm
  );

  const value: SearchRequest = {
    searchKey: searchTerm,
    categorySlugs: categoryIds,
    minPrice: minPrice,
    maxPrice: maxPrice,
  };

  try {
    const response: any = await BeseAxios.post(MegaSearchUri, value);
    console.log("@@FilteredProducts", response);
    return response.data.content;
  } catch (err) {
    console.log(err);
  }
};
