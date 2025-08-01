import { BeseAxios } from "../../../web-constants/constants";
export const AvatarUri = "customer/profile/get/my-avatar";

export const CustomerDetailsUri = "customer/profile/get/my-details";
export const GetAddressUri = "customer/profile/get/addresses";
export const GetMyAddressUri = "customer/profile/get/my-addresses";
export const CreateWishlistUri = "customer/profile/create/wishlist";

export const GetWishlistUri = "customer/profile/get/my-wishlists";

export const CreateWishlistItemUri = "customer/profile/create/wishlist-item";

export const GetWishlistByIdUri = "customer/profile/get/wishlist";

export const DeleteWishlistItemUri = "/customer/profile/delete/wishlist-item";
export const DeleteWishlistIteFromDefaultUri =
  "customer/profile/delete/item/by/wishlist";

export const DeleteAddressUri = "customer/profile/delete/address";

export const AddressUpdateUri = "customer/profile/update/address";

export const OrdersUri = "orders/txn/get/by/customer";

export const OrderStatusUri = "orders/txn/get/summary/by/orderNum";

export const OrderCancelUri = "orders/txn/cancel";

export const updateAvatarUri = "security/auth/update/avatar";

export const AddAvatarUri = "security/auth/create/avatar";

export const DeleteAavatarUri = "security/auth/delete/avatar";

export const UpdateWishlistUri = "customer/profile/update/wishlist";

export const isDefaultWishlistUri = "customer/profile/update/wishlist-default";

export const DeleteWishlistUri = "customer/profile/delete/wishlist";

export const MovetoWishlistUri = "customer/profile/update/wishlist/move-items";

export const UpdateProfileUrl = "customer/profile/update/my-details";
export const GetLocationDetails = "geoapify/location";

export const updateIsDefaultAddressUri =
  "customer/profile/update/address/set-default";

export const GetWishlistDefaultUri = "customer/profile/get/wishlist/default";

export const GetOrderSummaryUri = "/orders/txn/get/summary/by/orderNum";

export const reviewElements = "/orders/txn/get/order-rating-elements/active";

export const addRatingsDetailsUri =
  "/orders/txn/create/multi/order-ratings-details";

export const createReview = "/orders/txn/create/order-review";

export const GetEstimationDelivery = "inventory/item/get/delivery-estimation";

export const GetAddresslatitudelongitude = "geoapify/reverse";

export const GetEstimationDeliveryByusername =
  "inventory/item/get/delivery-estimation/by/customer";

export const OrderReturnUri = "orders/txn/create/return-items";

export const CancelOrderReasons = "/orders/txn/get/cancel-reasons";

export const CancelOrderUri = "/orders/txn/cancel";

export const OrdersByOrderNum = "/orders/txn/get/by/orderNum";

export const GetOrderReturnReasons = "/orders/txn/get/return-reasons";

export const OrderRetrunCreateUri = "/orders/txn/create/return-items";

export const CreateTicketUri = "/support/ticket/create";

export const GetTicketUri = "support/ticket/get/by/customer";

export const GetTicketByIdUri = "support/ticket/get";

export const GetCustomerDetailsUri = "/customer/profile/get/my-details";

export const getCustomerOrdersFilteredUri = (username: string): string => {
  return `/orders/txn/get/by/customer/${username}/filters`;
};

export const getCustomerOrdersSearchUri = "/orders/txn/get/by/customer/search";

export const AddOrderRatingUri = "/orders/txn/create/rating";

export const newsLetterSubscriptionUri = "/marketing/newsletter/subscription";

export const getOrderReturnRequestUri = "/orders/txn/get/return-request";

export const subscribeToNewsletter = async (emailId: string) => {
  const response: any = await BeseAxios.post(newsLetterSubscriptionUri, null, {
    params: {
      emailId: emailId,
    },
  });

  return response.data.content;
};

export const DefaultUri = async (
  wishlistId: number,
  toggleDefault: boolean
) => {
  console.log(
    "DefaultUri called. ID:",
    wishlistId,
    "toggleDefault:",
    toggleDefault
  );

  try {
    const response: any = await BeseAxios.patch(
      `${isDefaultWishlistUri}/${wishlistId}`,
      null,
      {
        params: {
          toggleDefault: toggleDefault,
        },
      }
    );
    console.log("DefaultUri success response:", response);

    return response.data.content;
  } catch (error) {
    console.error("Error toggling default wishlist:", error);
    throw error;
  }
};

export const updateAvatar = async (
  username: string,
  avatarFile: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("avatar", avatarFile, avatarFile.name);

    const response: any = await BeseAxios.put(updateAvatarUri, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.content;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const createAvatar = async (
  username: string,
  avatarFile: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("avatar", avatarFile, avatarFile.name);

    const response: any = await BeseAxios.post(AddAvatarUri, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("API Response:", response);

    return response.data.content;
  } catch (error) {
    console.error("Error creating avatar:", error);
    throw error;
  }
};

export const getaddressData = async (username: string) => {
  try {
    const response: any = await BeseAxios.get(GetAddressUri, {
      params: { username: username },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching Address:", error);
    throw error;
  }
};
export const getMyAddressData = async (username: string) => {
  try {
    const response: any = await BeseAxios.get(GetMyAddressUri, {
      params: { username: username },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching Address:", error);
    throw error;
  }
};

export const addressDeleleData = async (customerAddressId: number) => {
  try {
    const response: any = await BeseAxios.delete(
      `${DeleteAddressUri}/${customerAddressId}`
    );

    return response.data.content;
  } catch (error) {
    console.error("Error deleting Address:", error);
    throw error;
  }
};

export const CancelOrder = async (orderNum: string) => {
  try {
    const response: any = await BeseAxios.patch(
      `${OrderCancelUri}/${orderNum}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error cancel Order:", error);
    throw error;
  }
};

export const getWishlists = async (username: string | null) => {
  try {
    const response: any = await BeseAxios.get(GetWishlistUri, {
      params: { username: username || "" },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    throw error;
  }
};

export const getWishlistById = async (wishlistId: number) => {
  try {
    const response: any = await BeseAxios.get(GetWishlistByIdUri, {
      params: { wishlistId: wishlistId },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching wishlist :", error);
    throw error;
  }
};

export const DeleteProfile = async (username: string) => {
  try {
    const response: any = await BeseAxios.delete(DeleteAavatarUri, {
      params: { username: username },
    });
    return response.data.content;
  } catch (error) {
    console.error("Error Delete Avatar :", error);
    throw error;
  }
};

export const SetIsDefaultAddress = async (customerAddressId: number) => {
  try {
    const response: any = await BeseAxios.patch(
      updateIsDefaultAddressUri,
      {},
      {
        params: {
          customerAddressId,
        },
      }
    );
    return response.data.content;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};

export const getLocationData = async (postalCode: number) => {
  try {
    const response: any = await BeseAxios.get(GetLocationDetails, {
      params: { postalCode: postalCode },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching Location Details :", error);
    throw error;
  }
};

export const getEstimationDeliverydata = async (pincode: number) => {
  try {
    const response: any = await BeseAxios.get(GetEstimationDelivery, {
      params: { pincode: pincode },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error fetching Deliverydata Details :", error);
    throw error;
  }
};

export const getLatitudeAndLongitude = async (lat: string, lon: string) => {
  try {
    const response: any = await BeseAxios.get(GetAddresslatitudelongitude, {
      params: { lat, lon },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error Fetching Latitude and Longitude:", error);
    throw error;
  }
};

export const getEstDeliveryByusername = async (username: string) => {
  try {
    const response: any = await BeseAxios.get(GetEstimationDeliveryByusername, {
      params: { username },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error Fetching EstDeliveryByusername Details:", error);
    throw error;
  }
};

export const getOrderItems = async (orderNum: string) => {
  try {
    const response: any = await BeseAxios.get(GetOrderSummaryUri, {
      params: { orderNum },
    });

    return response.data.content;
  } catch (error) {
    console.error("Error Fetching Order Details:", error);
    throw error;
  }
};
