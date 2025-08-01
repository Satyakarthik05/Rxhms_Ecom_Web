import { ProductStatusType } from "../enum/productStatusType";

export interface ProductCard {
  productId: number | null;
  productCode: string;
  itemId: number;
  itemSlug: string;
  productSlug: string;
  productTitle: string;
  itemTitle: string;
  itemMrp: number;
  itemPrice: number;
  itemDiscount: number;
  itemImage: string;
  productStatus?: ProductStatusType;
  itemStatus?: ProductStatusType;
  currency?: string;
  qty?: number;
  minQty?: number;
  maxQty?: number;
  isDefaultItem?: boolean;
  isDefaultImg?: boolean;
  returnAllowed?: boolean;
  minStockAlert?:boolean;
  availableStock?:number;
}
