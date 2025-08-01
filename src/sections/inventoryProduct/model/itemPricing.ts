import { Item } from "./item";

export interface ItemPricing {
  id?: number;
  itemId?: number;
  batchId?: number;
  mrp: number;
  marketPrice: number;
  price?: number;
  discount: number;
  currency?: string;
  lastUpdatedOn?: Date;
  priceChangedOn?: Date;
}
