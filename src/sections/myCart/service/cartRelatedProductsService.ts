// import { List } from "antd";
import { BeseAxios } from "../../../web-constants/constants";

export const cartRelatedProductsService = async (
  itemSlugs: string[],
  offset: number
) => {
  try {
    console.log("@@@inservice TRY", itemSlugs, "NNN", offset);

    const response: any = await BeseAxios.get(
      "inventory/item/get/related-items",
      {
        params: {
          itemSlugs: itemSlugs.toString(),
          offset,
          // pageSize: 1,
        },
      }
    );
    console.log("@@@inservice response", response.data.content);
    return response.data.content;
  } catch (error) {
    console.log("@@@inservice CATCH", itemSlugs, "NNN", offset);
    console.error("Error fetching data:", error);
  }
};
