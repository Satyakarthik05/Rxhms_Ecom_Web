import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Breadcrumbs,
  Link,
  CircularProgress,
} from "@mui/material";
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
import type { ProductReviews } from "../inventoryProduct/model/ProductReviews";
import type { ProductReviewGallery } from "../inventoryProduct/model/productReviewGallery";
import type { ItemDetails } from "../inventoryProduct/model/ItemDetails";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import { Divider } from "antd";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store/store";
import {
  PageState,
  setLocalText,
  WEBSITE_BASE_URL_FOR_SHARE,
} from "../../web-constants/constants";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  createWishlistItemAsync,
  deleteDefaultWishItemAsync,
  getDefaultWishlistAsync,
} from "../../Redux/slices/wishListSlice";
import { useDispatch } from "react-redux";
import type { LoginResponse } from "../login/model/loginResponse";
import { usePostByParams } from "../../customHooks/usePostByParams";
import { share_product } from "./service/getitemsDetails";

interface LocationState {
  itemDetails: ItemDetails;
}

const ReviewImageGalleryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemDetails } = location.state as LocationState;
  const {
    itemTitle,
    itemSlug,
    productCode,
    itemPricing,
    itemGallery,
    productReviews,
    variants,
  } = itemDetails;

  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sharableData, setSharableData] = useState<any>({
    description: itemTitle,
    url: itemTitle,
    title: itemTitle,
  });

  const { slug } = useParams();
  const { status: wishlistStatus, defaultWishListItemsIds } = useSelector(
    (store: RootState) => store.wishlist
  );
  const [isWishlisted, setIsWishlisted] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });
  const username = useSelector((state: RootState) => state.jwtToken.username);

  const path = location.pathname;

  const { data, executePost } = usePostByParams();

  const images =
    productReviews
      ?.flatMap((review: ProductReviews) =>
        (review.productReviewGalleryList || [])
          .filter((img: ProductReviewGallery) => img?.imageUrl)
          .map((img: ProductReviewGallery) => ({
            imageUrl: img.imageUrl,
            review,
          }))
      )
      ?.sort(
        (a, b) =>
          new Date(b.review.generatedOn).getTime() -
          new Date(a.review.generatedOn).getTime()
      ) || [];

  useEffect(() => {
    dispatch(getDefaultWishlistAsync({ username: username }));
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

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const label = decodeURIComponent(slug ? slug : "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const dispatch = useDispatch<AppDispatch>();

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

  console.log("Share_Order_response&&&");
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

  // Share URL and title
  const shareUrl = `${WEBSITE_BASE_URL_FOR_SHARE}/product/${itemSlug}`;
  const shareTitle = `Check out this amazing product: ${itemTitle}`;

  // if (!shareOpen) return null;

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
              Gallery
            </Link>
          </Breadcrumbs>
        </div>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box>
          <Box
            sx={{
              mt: 2,
              mb: 2,
              bgcolor: "#fff",
              zIndex: 10,
            }}
            maxWidth={1100}
            mx="auto"
            width="100%"
          >
            {/* Display the product card*/}
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box>
                  <Box position="relative">
                    <img
                      src={itemGallery[0]?.fileUrl || "/placeholder.svg"}
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
                            // removeItem in the default wishlist
                            setIsWishlisted(itemPricing.itemId);
                            deleteWishlistItemFromDefault(itemPricing.itemId);
                          } else if (itemPricing && itemPricing.itemId) {
                            setIsWishlisted(itemPricing.itemId);
                            handleAddToWishlist();
                          }
                        }}
                      >
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
                              bgcolor: "#E3E8EF",
                              display: "flex",
                              p: 1,
                              borderRadius: 1,
                              gap: 1,
                            }}
                            position="absolute"
                            top={40}
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
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                              }}
                            >
                              <EmailIcon size={24} round />
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
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                              }}
                            >
                              <WhatsappIcon size={24} round />
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
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                                padding: 0,
                              }}
                            >
                              <FacebookIcon size={24} round />
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
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                              }}
                            >
                              <TwitterIcon size={24} round />
                            </TwitterShareButton>

                            <LinkedinShareButton
                              url={sharableData.url}
                              title={sharableData.title || ""}
                              summary={`${sharableData.description}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                              }}
                            >
                              <LinkedinIcon size={24} round />
                            </LinkedinShareButton>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    overflowY: "auto",
                    pr: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {itemTitle}
                  </Typography>
                  <Typography variant="h6" color="#4E3C31">
                    {itemPricing.currency}
                    {"\u200A"}
                    {itemPricing.price}
                    <del style={{ color: "#888", marginLeft: 8 }}>
                      {itemPricing.currency}
                      {"\u200A"}
                      {itemPricing.mrp}
                    </del>
                    <Chip
                      label={`${itemPricing.discount} %`}
                      size="small"
                      sx={{ ml: 1, bgcolor: "#0AA44F" }}
                    />
                  </Typography>
                  <Box mt={2}>
                    <Stack direction="row" spacing={1} mt={1}>
                      {variants?.map((variant) => (
                        <Box key={variant.id} mt={2}>
                          <Typography fontWeight="bold">
                            {variant.keyName}
                          </Typography>
                          <Stack direction="row" spacing={1} mt={1}>
                            {variant.variantSpecValues.map((value, idx) => (
                              <Button
                                key={`${value.productSpecId}-${value.keyValue}`}
                                variant={idx === 0 ? "contained" : "outlined"}
                                size="small"
                                sx={
                                  idx === 0
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
                </Box>
              </Grid>
            </Grid>
            <Divider />
          </Box>

          {/* Display the images*/}
          <Box
            maxWidth={1100}
            mx="auto"
            width="100%"
            sx={{ overflowY: "scroll" }}
          >
            <Grid container spacing={2}>
              {images.map((img, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box
                    component="img"
                    src={img.imageUrl}
                    alt={img.review.title}
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      objectFit: "cover",
                      height: 200,
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpen(index)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogContent sx={{ position: "relative", p: 3 }}>
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={handlePrev}>
                <ArrowBackIosNewIcon />
              </IconButton>

              <Box sx={{ width: "100%", textAlign: "center" }}>
                <Box
                  component="img"
                  src={images[currentIndex].imageUrl}
                  alt={images[currentIndex].review.title}
                  sx={{ maxHeight: 400, maxWidth: "100%", borderRadius: 2 }}
                />
                <Typography variant="h6" sx={{ mt: 2, color: "primary.main" }}>
                  {images[currentIndex].review.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {images[currentIndex].review.description}
                </Typography>
                <Typography variant="caption" sx={{ color: "green" }}>
                  Posted by: {images[currentIndex].review.username}
                </Typography>
              </Box>

              <IconButton onClick={handleNext}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default ReviewImageGalleryPage;
