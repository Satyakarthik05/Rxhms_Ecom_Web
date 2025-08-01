import {
  Box,
  Typography,
  Button,
  Rating,
  Avatar,
  IconButton,
  Divider,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Tooltip,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ItemDetails } from "../inventoryProduct/model/ItemDetails";
import React, { useState, useRef, useEffect } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import { useDispatch } from "react-redux";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import AddProductReviewDrawer from "./addProductReviewDrawer";
import { ProductReviews } from "../inventoryProduct/model/ProductReviews";
import { getItemDetails, share_product } from "./service/getitemsDetails";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { AppDispatch, RootState } from "../../Redux/store/store";
import { useSelector } from "react-redux";
import { PageState, setLocalText } from "../../web-constants/constants";
import {
  createWishlistItemAsync,
  deleteDefaultWishItemAsync,
  getDefaultWishlistAsync,
} from "../../Redux/slices/wishListSlice";
import { LoginResponse } from "../login/model/loginResponse";
import path from "path";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { usePostByParams } from "../../customHooks/usePostByParams";

interface LocationState {
  itemDetails: ItemDetails;
  slug: string;
}

const ProductAllReviews = () => {
  const location = useLocation();
  const { itemDetails: initialItemDetails } = location.state as LocationState;
  const {
    itemTitle,
    itemPricing,
    itemSlug,
    productCode,
    itemGallery,
    productReviews,
    variants,
    productId,
  } = initialItemDetails;

  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement | null>(null);
  const [openReviewDrawer, setOpenReviewDrawer] = useState(false);
  const [reviews, setReviews] = useState<ProductReviews[]>(
    [...productReviews].sort(
      (a, b) =>
        new Date(b.generatedOn).getTime() - new Date(a.generatedOn).getTime()
    )
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });

  const currentItem = itemPricing?.itemId ? itemPricing?.itemId : null;
  const { slug } = useParams();
  const path = location.pathname;
  const { data: fetchedItemDetails } = useFetchByQuery<ItemDetails>(
    getItemDetails,
    {
      itemSlug: slug,
    }
  );
  const [isWishlisted, setIsWishlisted] = useState<number | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { executePost } = usePostByParams();

  const itemDetails = fetchedItemDetails || initialItemDetails;
  const {
    itemTitle: fetchedItemTitle,
    itemPricing: fetchedItemPricing,
    itemGallery: fetchedItemGallery,
    productReviews: fetchedProductReviews,
    variants: fetchedVariants,
    productId: fetchedProductId,
  } = itemDetails;

  const [open, setOpen] = useState(false);
  const [sharableData, setSharableData] = useState<any>({
    description: itemTitle,
    url: itemTitle,
    title: itemTitle,
  });
  const username = useSelector((state: RootState) => state.jwtToken.username);
  const { status: wishlistStatus, defaultWishListItemsIds } = useSelector(
    (store: RootState) => store.wishlist
  );

  useEffect(() => {
    dispatch(getDefaultWishlistAsync({ username }));
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target as Node)
      ) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleShare = async () => {
    const response: any = await executePost(share_product, {
      itemSlug: itemSlug,
    });

    setSharableData(response.content);
  };

  console.log("sharableData", sharableData);

  useEffect(() => {
    if (shareOpen) {
      handleShare();
    }
  }, [shareOpen]);

  const handleAddReview = () => {
    setOpenReviewDrawer(true);
    dispatch(removeSticky());
  };

  const handleReviewSubmitted = (newReview: ProductReviews) => {
    setReviews((prev) =>
      [newReview, ...prev].sort(
        (a, b) =>
          new Date(b.generatedOn).getTime() - new Date(a.generatedOn).getTime()
      )
    );
  };

  const handleAddToWishlist = async () => {
    const loginResponseData: LoginResponse = JSON.parse(
      localStorage.getItem("loginResponse") || "{}"
    );

    if (!loginResponseData.username || !loginResponseData.isCustomerExist) {
      if (setLocalText) {
        setLocalText("path", path);
      }
      navigate("/login");
      return;
    }

    try {
      await dispatch(
        createWishlistItemAsync({
          username,
          productCode: productCode,
          itemId: itemPricing.itemId,
        })
      ).unwrap();
      await dispatch(getDefaultWishlistAsync({ username }));

      if (wishlistStatus === PageState.SUCCESS) {
        setIsWishlisted(null);
        setSnackbar({
          open: true,
          message: "Added to Wishlist!",
          severity: "success",
        });
      }
    } catch (error) {
      if (wishlistStatus === PageState.ERROR) {
        setSnackbar({
          open: true,
          message: "Failed to add to Wishlist. Try again!",
          severity: "error",
        });
      }
    }
  };

  const deleteWishlistItemFromDefault = async (wishlistItemId: number) => {
    try {
      await dispatch(
        deleteDefaultWishItemAsync({
          itemId: wishlistItemId,
          wishlistId: null,
          username: username,
        })
      );

      if (wishlistStatus === PageState.SUCCESS) {
        setIsWishlisted(null);
        setSnackbar({
          open: true,
          message: "Item removed from wishlist",
          severity: "success",
        });
      }
      await dispatch(getDefaultWishlistAsync({ username }));
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Failed to remove item from your wishlist",
        severity: "error",
      });
    }
  };

  let label = decodeURIComponent(slug ? slug : "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  console.log("@@@defaultWishListItemsIds", defaultWishListItemsIds);
  console.log("@@@itemPricing.itemId", itemPricing.itemId);

  return (
    <>
      <Box
        sx={{ padding: 1, backgroundColor: (theme) => theme.palette.info.main }}
      >
        <div className="container">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={
              <NavigateNextOutlinedIcon
                fontSize="small"
                sx={{ color: "#77878F" }}
              />
            }
          >
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate(`/product/${slug}`)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {label}
            </Link>
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate(`/product/${slug}`)}
              sx={{
                cursor: true ? "default" : "pointer",
                "&:hover": {
                  textDecoration: true ? "none" : "underline",
                },
                ...(true && {
                  color: (theme) => theme.palette.success.light,
                  fontWeight: 500,
                }),
              }}
            >
              Reviews
            </Link>
          </Breadcrumbs>
        </div>
      </Box>
      <Box p={4} display="flex" justifyContent="center">
        <Box width="100%" maxWidth="1200px">
          <Box
            sx={{
              mb: 4,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box position="relative" sx={{ height: "250px" }}>
                  <img
                    src={
                      fetchedItemGallery[0]?.fileUrl || itemGallery[0]?.fileUrl
                    }
                    alt="Product"
                    style={{ width: "100%", height: "100%", borderRadius: 8 }}
                  />
                  <Box position="absolute" top={8} right={8}>
                    <IconButton
                      sx={{
                        backgroundColor: "#fff",
                        "&:hover": {
                          backgroundColor: "#fff",
                        },
                      }}
                      aria-label="add to favorites"
                      onClick={() => {
                        if (
                          itemPricing &&
                          itemPricing.itemId &&
                          defaultWishListItemsIds.includes(itemPricing.itemId)
                        ) {
                          // removeItem in the defalut wishlist
                          setIsWishlisted(itemPricing.itemId);
                          deleteWishlistItemFromDefault(itemPricing.itemId);
                        } else if (itemPricing && itemPricing.itemId) {
                          setIsWishlisted(itemPricing.itemId);
                          handleAddToWishlist();
                        }
                      }}
                    >
                      {/* {defaultWishListItemsIds.includes(product.itemId) ? (
                              <Favorite color="error" fontSize="medium" />
                            ) : (
                              <FavoriteBorder fontSize="medium" />
                            )} */}

                      {wishlistStatus === PageState.LOADING &&
                      isWishlisted === itemPricing.itemId ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : defaultWishListItemsIds.includes(
                          itemPricing && itemPricing.itemId
                            ? itemPricing.itemId
                            : 0
                        ) ? (
                        <Favorite color="error" fontSize="medium" />
                      ) : (
                        <FavoriteBorder fontSize="medium" />
                      )}
                    </IconButton>

                    <Box
                      position="relative"
                      ref={shareRef}
                      display="inline-block"
                      ml={1}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => setShareOpen((prev) => !prev)}
                        sx={{ bgcolor: "#fff", zIndex: 10 }}
                      >
                        <ShareIcon />
                      </IconButton>

                      {shareOpen && (
                        <Box
                          sx={{
                            bgcolor: "#fff",
                            display: "flex",
                            p: 1,
                            borderRadius: 1,
                            gap: 1,
                          }}
                          position="absolute"
                          top={45}
                          right={0}
                          boxShadow={3}
                          borderRadius={2}
                          zIndex={20}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Fixed share buttons - removed IconButton wrappers */}
                          <EmailShareButton
                            url={sharableData.url}
                            subject={sharableData.title || ""}
                            body={sharableData.description}
                            // body={`Hi,\n\nI found this amazing product and thought you might like it!\n\n${itemTitle}\nView it here: ${shareUrl}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              backgroundColor: "#fff",
                            }}
                          >
                            <EmailIcon size={30} round />
                          </EmailShareButton>

                          <WhatsappShareButton
                            url={sharableData.url}
                            title={`\n${sharableData.title || ""}\n\n${
                              sharableData.description
                            }\n`}
                            separator=" "
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              backgroundColor: "#fff",
                            }}
                          >
                            <WhatsappIcon size={30} round />
                          </WhatsappShareButton>

                          <FacebookShareButton
                            url={sharableData.url}
                            title={`\n${sharableData.title || ""}\n\n${
                              sharableData.description
                            }\n`}
                            hashtag={`#${
                              sharableData.title || "".replace(/\s+/g, "")
                            }`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              backgroundColor: "#fff",
                              padding: 0,
                            }}
                          >
                            <FacebookIcon size={30} round />
                          </FacebookShareButton>

                          <TwitterShareButton
                            url={sharableData.url}
                            title={`\n${sharableData.title || ""}\n\n${
                              sharableData.description
                            }\n`}
                            hashtags={[
                              sharableData.title ||
                                "".replace(/\s+/g, "").toLowerCase(),
                            ]}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              backgroundColor: "#fff",
                            }}
                          >
                            <TwitterIcon size={30} round />
                          </TwitterShareButton>

                          <LinkedinShareButton
                            url={sharableData.url}
                            title={sharableData.title || ""}
                            summary={`${sharableData.description}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              backgroundColor: "#fff",
                            }}
                          >
                            <LinkedinIcon size={30} round />
                          </LinkedinShareButton>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h5" fontWeight="bold">
                  {fetchedItemTitle || itemTitle}
                </Typography>
                <Typography variant="h6" color="#4E3C31">
                  {fetchedItemPricing.currency}
                  {"\u200A"}
                  {fetchedItemPricing?.price || itemPricing.price}{" "}
                  <del style={{ color: "#888", marginLeft: 8 }}>
                    {fetchedItemPricing.currency}
                    {"\u200A"}
                    {fetchedItemPricing?.mrp || itemPricing.mrp}
                  </del>{" "}
                  <Chip
                    label={`${
                      fetchedItemPricing?.discount || itemPricing.discount
                    } %`}
                    size="small"
                    sx={{ bgcolor: "#0AA44F" }}
                  />
                </Typography>
                <Box mt={2}>
                  <Stack direction="row" spacing={1} mt={1}>
                    {(fetchedVariants || variants)?.map((variant) => (
                      <Box key={variant.id} mt={2}>
                        <Typography fontWeight="bold">
                          {variant.keyName}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                          {variant.variantSpecValues.map((value, idx) => (
                            <Button
                              key={`${value.productSpecId}-${value.keyValue}`}
                              variant={
                                value.itemId === currentItem
                                  ? "contained"
                                  : "outlined"
                              }
                              size="small"
                              sx={
                                value.itemId === currentItem
                                  ? {
                                      backgroundColor: "#334F3E",
                                      color: "#FFFFFF",
                                      textTransform: "none",

                                      "&:hover": {
                                        backgroundColor: "#2B4235",
                                      },
                                    }
                                  : {
                                      borderColor: "#EED9CB",
                                      color: "#000",
                                      textTransform: "none",
                                      "&:hover": {
                                        backgroundColor: "#F9F4F1",
                                        borderColor: "#EED9CB",
                                      },
                                    }
                              }
                            >
                              {value.keyValue}
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box
            width="100%"
            maxWidth="800px"
            mx="auto"
            sx={{ overflowY: "scroll" }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" fontWeight="bold">
                Reviews (
                {fetchedProductReviews?.length || productReviews.length})
              </Typography>

              <Typography
                sx={{
                  cursor: "pointer",
                  color: "#334F3E",
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
                onClick={handleAddReview}
              >
                Write Review
              </Typography>
            </Box>

            <Box mt={2}>
              {(reviews || fetchedProductReviews || productReviews).map(
                (review) => (
                  <Box key={review.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography fontWeight="bold">{review.title}</Typography>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" mt={1}>
                        {review.description}
                      </Typography>

                      {review.productReviewGalleryList?.length > 0 && (
                        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                          {review.productReviewGalleryList.map((img) => (
                            <Box
                              key={img.id}
                              component="img"
                              src={img.imageUrl}
                              alt="review"
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                objectFit: "cover",
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={1}
                        display="block"
                      >
                        {review.username} | Posted on{" "}
                        {new Date(review.generatedOn).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            timeZone: "Asia/Kolkata",
                          }
                        )}
                      </Typography>
                    </CardContent>
                    <Divider sx={{ my: 2 }} />
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Box>

        <AddProductReviewDrawer
          open={openReviewDrawer}
          onClose={() => {
            setOpenReviewDrawer(false);
            dispatch(addSticky());
          }}
          productImage={
            fetchedItemGallery[0]?.fileUrl || itemGallery[0]?.fileUrl
          }
          productId={fetchedProductId || productId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </Box>
    </>
  );
};

export default ProductAllReviews;
