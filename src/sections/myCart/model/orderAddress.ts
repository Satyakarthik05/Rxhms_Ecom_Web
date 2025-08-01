import { AddressMaster } from "../../Dashboard/model/addressMaster";

export interface OrderAddress {
  id: number;
  orderId: number;
  billingAddress: AddressMaster;
  shippingAddress: AddressMaster;
}
