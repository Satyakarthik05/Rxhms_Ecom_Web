import { ProductStatusType } from "../enum/productStatusType";
import { ProductSpecs } from "./productSpecs";
import { Item } from "./item";

export interface Product {
  id: number;
  slug: string;
  productCode: string;
  title: string;
  description: string;
  status: ProductStatusType;
  items: Item[];
  productSpecs: ProductSpecs[];
}
