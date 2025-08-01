import { BeseAxios } from "../../../web-constants/constants";
import { GET_PRICE_PANGE_BY_SECTION } from "./service";

export const getPriceRangeWithSectionService = async (sectionSlug: string) => {
  try {
    const response: any = await BeseAxios.get(GET_PRICE_PANGE_BY_SECTION, {
      params: {
        sectionSlug: sectionSlug,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
