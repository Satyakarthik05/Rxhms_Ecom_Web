import { BeseAxios } from "../../../web-constants/constants";

export const emailLogin = async (mobileNumber: string) => {
  try {
    const response = await BeseAxios.post(
      "/security/auth/create/generate-otp",
      null,
      {
        params: {
          mobileNumber,
        },
      }
    );
    console.log("response ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
