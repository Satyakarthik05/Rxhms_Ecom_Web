import { BeseAxios } from "../../../web-constants/constants";
import { GetAddress, getOrderAddressByOrderNum } from "./myCartService";

export const getAddressService = async (username: string) => {
  console.log("username", username);
  var response: any = null;
  try {
    response = await BeseAxios.get(GetAddress, {
      params: { username: username },
    });

    console.log("response @@ Get Address in add To Cart", response.data.conten);
    return response.data;
  } catch (err) {
    console.log("getAddress Service error", err);
    console.log("getAddress Service error", response);
    return response;
  }
};

export const getAddressByOrderNumService = async (orderNumber: string) => {
  console.log("username", orderNumber);
  var response: any = null;
  try {
    response = await BeseAxios.get(getOrderAddressByOrderNum, {
      params: { orderNumber },
    });
    console.log("response @@ Get Address in add To Cart", response.data.conten);
    return response.data;
  } catch (err) {
    console.log("getAddress Service error", err);
    console.log("getAddress Service error", response);
    return response;
  }
};
