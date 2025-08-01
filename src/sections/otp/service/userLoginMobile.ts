import { BeseAxios } from "../../../web-constants/constants";
import { LoginRequest } from "../../login/model/loginRequest";

export const userLoginMobile = async (loginRequestData: LoginRequest) => {
  if (loginRequestData) {
    try {
      const response = await BeseAxios.post(
        "/security/auth/mobile-login",
        loginRequestData
      );
      console.log("response ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};
