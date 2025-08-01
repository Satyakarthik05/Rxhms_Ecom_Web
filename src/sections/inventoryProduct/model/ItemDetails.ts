import { DataSection } from "../../header/model/dataSection";
import { ProductStatusType } from "../enum/productStatusType";
import { ItemGallery } from "./itemGallery";
import { ItemPricing } from "./itemPricing";
import { ItemSpecs } from "./itemSpecs";
import { ProductCard } from "./productCard";
import { ProductIngredients } from "./productIngredients";
import { ProductReviews } from "./ProductReviews";
import { ProductVariantParams } from "./productVariantParams";

export interface ItemDetails {
  productId: number;
  productCode: string;
  itemTitle: string;
  itemSlug: string;
  sku: string;
  gtin: string;
  description: string;
  minOrderQty: number;
  maxOrderQty: number;
  returnAllowed?: boolean;
  minStockAlert?: boolean;
  availableStock?: number;
  productStatus?: ProductStatusType;
  itemStatus?: ProductStatusType;
  itemPricing: ItemPricing;
  ingredients: ProductIngredients[];
  productData: DataSection[];
  variants?: ProductVariantParams[];
  itemSpecs: ItemSpecs[];
  itemGallery: ItemGallery[];
  productReviews: ProductReviews[];
  relatedProducts: ProductCard[];
}
