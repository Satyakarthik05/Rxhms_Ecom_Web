import { BeseAxios } from "../../../web-constants/constants";
import { getVariant } from "./getitemsDetails";

export const getVariantService = async (
  productId: number,
  keyName: string,
  keyValue: string
) => {
  console.log("before serviecall getVariant", productId, keyName, keyValue);
  var response: any = null;
  try {
    response = await BeseAxios.get(getVariant, {
      params: { productId: productId, keyName: keyName, keyValue: keyValue },
    });
    console.log("response @@ Get Address in add To Cart", response.data.conten);
    return response.data.content;
  } catch (err) {
    console.log("getAddress Service error", err);
    console.log("getAddress Service error", response);
  }
};
