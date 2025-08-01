import { AddressType } from "../../Dashboard/enum/addressType";
import { AddressMaster } from "../../Dashboard/model/addressMaster";
import { CustomerAddress } from "../../Dashboard/model/customerAddress";
import { OrderAddress } from "./orderAddress";

export interface CheckoutAddress {
  billingAddress: AddressMaster;
  shippingAddress: AddressMaster;
}

export const mapFromOrderAddress = (
  orderAddress: OrderAddress
): CheckoutAddress => {
  return {
    billingAddress: orderAddress.billingAddress,
    shippingAddress: orderAddress.shippingAddress,
  };
};

export const mapFromCustomerAddresses = (
  customerAddresses: CustomerAddress[]
): CheckoutAddress => {
  const billing = customerAddresses.find(
    (a) => a.addressType === AddressType.BILLING
  );
  const shipping = customerAddresses.find(
    (a) => a.addressType === AddressType.SHIPPING
  );

  return {
    billingAddress: billing?.address ?? customerAddresses[0].address,
    shippingAddress: shipping?.address ?? customerAddresses[0].address,
  };
};
