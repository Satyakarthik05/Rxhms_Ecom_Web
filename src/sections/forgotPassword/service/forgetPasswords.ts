import { BeseAxios } from "../../../web-constants/constants";
import { ForgotServiceUri } from "./serviceUris";

export const forgotService = async (emailId: string) => {
  console.log(" in SERVICE emailId", emailId);
  try {
    const response = await BeseAxios.post(ForgotServiceUri, null, {
      params: {
        emailId: emailId,
      },
    });
    console.log("response ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
