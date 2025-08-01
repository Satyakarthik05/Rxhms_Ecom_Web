import { BeseAxios } from "../../../web-constants/constants";
import { GET_FILTERED_CATEGORIES } from "./service";

export const getFilterCategoryService = async (searchTerm: string) => {
  try {
    const response: any = await BeseAxios.get(GET_FILTERED_CATEGORIES, {
      params: {
        searchRequest: searchTerm,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
