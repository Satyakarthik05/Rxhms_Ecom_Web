import { Checkout } from "./checkOut";

export interface CreateOrder {
  orderNum: string | null;
  checkoutDetails?: Checkout;
  couponTxnId: number | string;
  taxAmount: number | null;
  shippingCharge: number | null;
  finalPrice: number;
  couponDiscAmount: number;
  paymentMethod: string | null;
  billingAddressId: number | any;
  shippingAddressId: number | any;
  cpgOrderId?: string;
}
