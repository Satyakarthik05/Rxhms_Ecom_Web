import { ProductStatusType } from "../enum/productStatusType";
import { ItemGallery } from "./itemGallery";
import { ItemPricing } from "./itemPricing";
import { ItemSpecs } from "./itemSpecs";

export interface Item {
  id: number;
  slug: string;
  productId: number;
  sku: string;
  gtin: string;
  title: string;
  description: string;
  status: ProductStatusType;
  totalRatings: number;
  avgRating: number;
  isDefault: boolean;
  itemPricing: ItemPricing;
  itemSpecs: ItemSpecs[];
  minOrderQty: number;
  maxOrderQty: number;
  returnAllowed: boolean;
  minStockAlert?:boolean;
  availableStock?:number;

  // itemGallery: ItemGallery[];
}
