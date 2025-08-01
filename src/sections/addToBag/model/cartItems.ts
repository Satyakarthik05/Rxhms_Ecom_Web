import { ProductCard } from "../../inventoryProduct/model/productCard";

export interface CartItems {
  id: number;
  cartId: number;
  productId: number;
  itemId: number;
  qty: number;
  unitPrice: number;
  totalMrp: number;
  discAmount: number;
  totalPrice: number;
  imageUrl: string;
  fileId?: number;
  productCard?: ProductCard;
}
