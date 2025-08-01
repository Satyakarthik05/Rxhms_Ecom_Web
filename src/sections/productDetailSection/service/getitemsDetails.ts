import { BeseAxios } from "../../../web-constants/constants";
import { ProductReviews } from "../../inventoryProduct/model/ProductReviews";

export const getItemDetails = "inventory/item/get/details";
export const getVariant = "/inventory/item/get/details/by/spec";
export const UploadGallery = "/inventory/product/create/product-review";
export const share_product = "/inventory/product/create/product-share";
export const RatingsSummary = "/inventory/product/get/ratings-summary";

export const AddProductReview = async (
  review: ProductReviews,
  files: File[]
): Promise<string> => {
  try {
    const formData = new FormData();

    formData.append("productId", review.productId.toString());
    formData.append("username", review.username);
    formData.append("displayName", review.displayName);
    formData.append("title", review.title);
    formData.append("description", review.description);
    formData.append("rating", review.rating.toString());
    formData.append("displayable", review.displayable.toString());

    files.forEach((image) => {
      if (image instanceof File) {
        formData.append("reviewGallery", image);
        console.log("Item is a valid file:", image);
      } else {
        console.error("Item is not a valid file:", image);
      }
    });

    console.log("Form Data:", formData);

    const response: any = await BeseAxios.post(UploadGallery, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("API Response:", response);
    return response.data.content;
  } catch (error) {
    console.error("Error Upload Images:", error);
    throw error;
  }
};
