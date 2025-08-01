import { BeseAxios } from "../../../web-constants/constants";
import { paymenturi } from "./myCartService";

export const paymentServiceTest2 = async (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  let response: any = null;

  try {
    console.log("inService TEST@2", orderId, paymentId, signature);
    response = await BeseAxios.post(paymenturi, null, {
      params: {
        orderId: orderId,
        paymentId: paymentId,
        signature: signature,
      },
    });
    console.log("response @@ paymentServiceFormData", response.data.conten);
    return response.data.content;
  } catch (err) {
    console.log("paymentServiceFormData Service error", err);
    console.log("paymentServiceFormData Service error", response);
  }
};
