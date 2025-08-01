import { OrderDiscounts } from "./orderDiscounts";
import { OrderItems } from "./orderItems";
import { OrderStatus } from "./orderStatus";
import { PaymentMethod } from "./paymentMethod";
import { PaymentStatus } from "./paymentStatus";

export interface OrderMaster {
  id: number;
  orderNum: string;
  cpgOrderId?: string;
  username: string; //
  customerId: number;
  orderStatus: OrderStatus;
  totalPrice: number; //
  totalMrp?: number; //
  finalPrice?: number; //new

  totalItems?: number; //
  totalQty?: number; //
  discAmount: number; //

  couponDiscAmount: number; //new
  taxAmount: number; //new
  shippingCharge: number; //new

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  placedOn: string;
  fileId?: number;
  invoiceUrl?: string;
  returnTerm?: Date;
  orderRating?: number;
  isReviewed?: boolean; //
  awbCode?: string;
  orderItems: OrderItems[];
  orderDiscounts?: OrderDiscounts;
  retryPaymentTime?: string;
}
