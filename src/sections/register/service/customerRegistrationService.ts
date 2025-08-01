import { BeseAxios } from "../../../web-constants/constants";
import { CustomerRegistration } from "../model/customerRegistration";

export const customerRegistrationService = async (
  registrationData: CustomerRegistration
) => {
  if (registrationData) {
    const response = await BeseAxios.post(
      "/security/auth/create/customer",
      registrationData
    );
    console.log("response ", response.data);
    return response.data;
  }
};
