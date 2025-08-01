import { BeseAxios } from "../../../web-constants/constants";
import {
  GET_CATEGORY_BY_CATEGORY,
  GET_PRICE_PANGE_BY_CATEGORY,
} from "./service";

export const getCategoriesWithCategoryService = async (
  categorySlug: string
) => {
  try {
    const response: any = await BeseAxios.get(GET_CATEGORY_BY_CATEGORY, {
      params: {
        categorySlug: categorySlug,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getPriceRangeWithCategoryService = async (
  categorySlug: string
) => {
  try {
    const response: any = await BeseAxios.get(GET_PRICE_PANGE_BY_CATEGORY, {
      params: {
        categorySlug: categorySlug,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
