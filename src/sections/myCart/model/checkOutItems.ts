import { ProductCard } from "../../inventoryProduct/model/productCard";

export interface CheckoutItems {
  productId?: number;
  itemId?: number;
  batchId?: number;
  qty?: number;
  unitPrice?: number;
  totalMrp?: number;
  discAmount?: number;
  totalPrice?: number;
  returnAllow?: boolean;
  productCard?: ProductCard;
  reservedQty?:number;

}
