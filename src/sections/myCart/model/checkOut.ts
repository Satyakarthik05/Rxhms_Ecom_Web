import { CheckoutItems } from "./checkOutItems";

export interface Checkout {
  cartId?: number;
  username?: string;
  totalMrp?: number;
  totalPrice?: number;
  discAmount?: number;
  totalItems?: number;
  totalQty?: number;
  checkoutItems?: CheckoutItems[];
  retryPaymentTime?:string;
}

export interface CheckoutDetails extends Checkout {
  checkoutItems?: CheckoutItems[];
}
