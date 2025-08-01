import { AddressMaster } from "../../Dashboard/model/addressMaster";
import { ProductCard } from "../../inventoryProduct/model/productCard";
import { Customer } from "../../register/model/customer";
import { OrderStatus } from "./orderStatus";
import { PaymentMethod } from "./paymentMethod";
import { PaymentStatus } from "./paymentStatus";

export interface OrderResponse {
  id: number;
  orderNum: number;
  username: string;
  customer?: Customer;
  orderStatus: OrderStatus;
  totalMrp: number;
  finalPrice: number;
  couponDiscAmount: number;
  totalPrice: number;
  discAmount: number;
  taxAmount: number;
  shippingCharge: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  invoiceUrl?: string; // new
  placedOn: string;
  billingAddress: AddressMaster;
  shippingAddress: AddressMaster;
  productCards: ProductCard[];
}
