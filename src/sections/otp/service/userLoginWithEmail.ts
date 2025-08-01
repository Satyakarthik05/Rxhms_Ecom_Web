import { BeseAxios } from "../../../web-constants/constants";
import { LoginRequest } from "../../login/model/loginRequest";

export const userLoginWithEmail = async (loginRequestData: LoginRequest) => {
  let response: any = null;
  if (loginRequestData) {
    try {
      response = await BeseAxios.post(
        "/security/auth/login-email",
        loginRequestData
      );
      console.log("response ", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Msg:", error.response.data.error);
      } else {
        console.log("Err:", error.message);
      }
    }
  }
};
