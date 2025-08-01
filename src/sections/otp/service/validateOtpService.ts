import { BeseAxios } from "../../../web-constants/constants";

export const validateOtpService = async (otp: string, txnId: string) => {
  if (txnId && otp) {
    try {
      const response = await BeseAxios.post(
        "/security/auth/validate-otp",
        null,
        {
          params: {
            txnId,
            otp,
          },
        }
      );
      console.log("response ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};
