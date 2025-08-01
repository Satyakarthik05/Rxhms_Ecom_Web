import { BeseAxios } from "../../../web-constants/constants";
import { GET_PRODUCT_BY_CATEGORY } from "./service";

export const getDatawithSlugService = async (slug: string) => {
  try {
    const response: any = await BeseAxios.get(GET_PRODUCT_BY_CATEGORY, {
      params: {
        categorySlug: slug,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
