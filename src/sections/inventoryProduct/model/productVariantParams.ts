import { VariantSpecValues } from "./variantSpecValues";

export interface ProductVariantParams {
  id: number;
  keyName: string;
  specDefId: number;
  productId: number;
  variantSpecValues: VariantSpecValues[];
}
