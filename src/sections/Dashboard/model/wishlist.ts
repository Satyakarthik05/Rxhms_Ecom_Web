import { WishlistItem } from "./wishlistItem";

export interface Wishlist {
  id: number | null;
  customerId: number | null;
  username: string;
  name: string;
  sharable: boolean;
  isDefault: boolean;
  wishlistItem: WishlistItem[];
  defaultImageUrl?: string;
}
