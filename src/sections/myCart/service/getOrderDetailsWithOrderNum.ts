import { BeseAxios } from "../../../web-constants/constants";
import { getOrderDetailsWithOrderNum } from "./myCartService";

export const getOrderDetailsByOrderIdService = async (orderNum: string) => {
  console.log("orderNum", orderNum);
  var response: any = null;
  try {
    response = await BeseAxios.get(getOrderDetailsWithOrderNum, {
      params: { orderNum: orderNum },
    });
    console.log("response @@ Get Address in add To Cart", response.data.conten);
    return response.data;
  } catch (err) {
    console.log("getAddress Service error", err);
    console.log("getAddress Service error", response);
  }
};
