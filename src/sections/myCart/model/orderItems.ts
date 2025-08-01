import { ProductCard } from "../../inventoryProduct/model/productCard";

export interface OrderItems {
  id: number;
  orderId: number;
  batchId?: number;
  productId: number;
  itemId: number;
  qty: number;
  unitPrice: number;
  discAmount: number;
  totalPrice: number;
  totalMrp: number;
  returnAllowed: boolean;
  productCard: ProductCard;
  reservedQty?:number;

}

