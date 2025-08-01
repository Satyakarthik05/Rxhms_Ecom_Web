import { ProductReviewGallery } from "./productReviewGallery";

export interface ProductReviews {
  id: number | null;
  productId: number;
  username: string;
  displayName: string;
  title: string;
  description: string;
  rating: number;
  generatedOn: string;
  displayable: boolean;
  productReviewGalleryList: ProductReviewGallery[];

}