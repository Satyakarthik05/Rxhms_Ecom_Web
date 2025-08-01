import { BeseAxios } from "../../../web-constants/constants";
import { postOrderDetails } from "./myCartService";

export const getOrderResponseService = async (orderNum: string) => {
  console.log("orderNum", orderNum);
  var response: any = null;
  try {
    response = await BeseAxios.get(postOrderDetails, {
      params: { orderNum: orderNum },
    });
    console.log("response @@ Get Address in add To Cart", response.data.conten);
    return response.data.content;
  } catch (err) {
    console.log("getAddress Service error", err);
    console.log("getAddress Service error", response);
  }
};
