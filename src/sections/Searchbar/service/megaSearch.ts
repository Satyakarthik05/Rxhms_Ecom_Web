import { BeseAxios } from "../../../web-constants/constants";
import { MegaSearchUri } from "../../myCart/service/myCartService";

export const GetCompanyLogoUri = "/company/get/logo";

export const getMegaSearch = async (query: string) => {
  console.log("username", query);
  var response: any = null;
  try {
    response = await BeseAxios.get(MegaSearchUri, {
      params: { searchRequest: query },
    });
    console.log("response @@ Get Address in add To Cart", response.data.conten);
    return response.data.content;
  } catch (err) {
    console.log("getAddress Service error", err);
    console.log("getAddress Service error", response);
    return response;
  }
};
