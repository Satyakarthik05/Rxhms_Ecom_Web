export interface AddToCartRequest {
  username: string;
  productCode?: string;
  itemId?: number;
  qty: number;
  imageUrl?: string;
}
