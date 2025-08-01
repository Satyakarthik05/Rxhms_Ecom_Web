import { BeseAxios } from "../../../web-constants/constants";
import { PRODUCTS_CARDS_PAGES } from "./service";

export {};
export const getAllProductsService = async (pageNumber: number) => {
  try {
    const response: any = await BeseAxios.get(PRODUCTS_CARDS_PAGES, {
      params: {
        offset: pageNumber,
        pageSize: 9,
      },
    });
    console.log("@@All", response);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
