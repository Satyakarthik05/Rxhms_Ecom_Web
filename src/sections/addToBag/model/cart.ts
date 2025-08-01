import { CartItems } from "./cartItems";

export interface Cart {
  id?: number;
  username?: string;
  totalMrp?: number;
  totalPrice?: number;
  discAmount?: number;
  totalItems?: number;
  totalQty?: number;
  lastModifiedOn?: string | Date;
  cartItems: CartItems[];
}
