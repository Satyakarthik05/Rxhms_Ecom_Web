"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CardContent,
  Typography,
  Grid,
  Snackbar,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { getItemDetails, share_product } from "./service/getitemsDetails";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { ItemDetails } from "../inventoryProduct/model/ItemDetails";
import Ingredients from "./ingredients";
import ReviewSection from "./reviewSection";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import { useDispatch } from "react-redux";
import { getVariantService } from "./service/getVariantService";
import {
  addToCartAsync,
  clearCart,
  getCartAsync,
} from "../../Redux/slices/addToCart";
import type { AddToCartRequest } from "../addToBag/model/addToCartRequest";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store/store";
import { setLocalText } from "../../web-constants/constants";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import MuiAlert from "@mui/material/Alert";
import ChooseLocationDrawer from "./chooseLocarionDrawer";
import AddIcon from "@mui/icons-material/Add";
import {
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  ClickAwayListener,
} from "@mui/material";
import Grow from "@mui/material/Grow";
import {
  getDefaultWishlistAsync,
  getWishlistAsync,
} from "../../Redux/slices/wishListSlice";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddToWishlistModal from "../../utils/addToWishlistModal";
import CustomDrawer from "../Dashboard/wishlistDrawer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { setDeliveryInfo } from "../../Redux/slices/locationSlice";
import "./css/productDetailcard.css";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import type { LoginResponse } from "../login/model/loginResponse";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import XIcon from "@mui/icons-material/X";
import ShareIcon from "@mui/icons-material/Share";
import { usePostByParams } from "../../customHooks/usePostByParams";
import { usePatchByParams } from "../../customHooks/usePatchByParams";
import {
  decreaseCartItem,
  deleteCartItem,
  increaseCartItem,
} from "../myCart/service/myCartService";
import { useDeleteByParams } from "../../customHooks/useDeleteByParams";
import type { Cart } from "../addToBag/model/cart";
import { motion, AnimatePresence } from "framer-motion";
import { selectCurrencySymbol } from "../../Redux/slices/currencySlice";

const ProductDetailCard = () => {
  const [showSpecifications, setShowSpecifications] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [ItemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const username = useSelector((store: RootState) => store?.jwtToken?.username);
  const cartData = useSelector((store: RootState) => store.cart.cart.cartItems);
  const [isChooseLocationOpen, setIsChooseLocationOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const wishlists = useSelector((store: RootState) => store.wishlist.wishlist);
  const [showModal, setShowModal] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    image: string;
  } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pincode = useSelector((state: RootState) => state.location.pincode);
  const expectedDate = useSelector(
    (state: RootState) => state.location.expectedDate
  );
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const [sharableData, setSharableData] = useState<any>({
    description: ItemDetails?.itemTitle,
    url: ItemDetails?.itemTitle,
    title: ItemDetails?.itemTitle,
  });

  const { executePost } = usePostByParams();
  const {
    data: incDecData,
    loading: incDecLoading,
    error: incDecError,
    executePatch,
  } = usePatchByParams();

  const symbol = useSelector(selectCurrencySymbol);

  // Fixed: Better logic for checking if item is in cart
  const isCartItem = useMemo(() => {
    if (Array.isArray(cartData) && ItemDetails?.itemPricing?.itemId) {
      const cartItem = cartData.find(
        (item) => item.productCard?.itemId === ItemDetails.itemPricing.itemId
      );
      return cartItem;
    }
    return null;
  }, [cartData, ItemDetails?.itemPricing?.itemId]);

  // Fixed: Better logic for determining if item is in cart
  const isItemInCart = useMemo(() => {
    return isCartItem !== null && count > 0;
  }, [isCartItem, count]);

  const handleImges = (url: string) => {
    setMainImage(url);
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleConfirmDelivery = (info: {
    pincode: string;
    expectedDate: number;
  }) => {
    dispatch(setDeliveryInfo(info));
  };

  const handleChooseLocation = () => {
    setIsChooseLocationOpen(true);
    dispatch(removeSticky());
  };

  const openDrawer = () => {
    setDrawerOpen(true);
    dispatch(removeSticky());
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    dispatch(addSticky());
  };

  const { slug } = useParams();
  const slugRef = useRef(slug);

  const {
    data: ItemDetailsInitial,
    error,
    isLoading,
    fetchData,
  } = useFetchByQuery<ItemDetails>(getItemDetails, {
    itemSlug: slug,
  });

  useEffect(() => {
    if (slugRef.current !== slug) {
      slugRef.current = slug;
      fetchData?.(true, getItemDetails, {
        itemSlug: slug,
      });
    }
  }, [slug, fetchData]);

  const {
    data: deleteItemFromCart,
    loading,
    error: DeleteItemError,
    executeDelete,
  } = useDeleteByParams<Cart>();

  useEffect(() => {
    dispatch(getCartAsync({ username: username }));
  }, [incDecData, deleteItemFromCart, ItemDetails, username, dispatch]);

  useEffect(() => {
    if (ItemDetailsInitial) {
      setItemDetails(ItemDetailsInitial);
      dispatch(getDefaultWishlistAsync({ username: username }));
    }
  }, [ItemDetailsInitial, username, dispatch]);

  useEffect(() => {
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

  // Fixed: Update count when cart item changes
  useEffect(() => {
    if (isCartItem && isCartItem.qty) {
      setCount(isCartItem.qty);
    } else {
      setCount(0);
    }
  }, [isCartItem]);

  const handleIncrement = async (
    cartItemId: number,
    qty: number
  ): Promise<void> => {
    try {
      if (
        ItemDetails &&
        ItemDetails.maxOrderQty &&
        qty >= ItemDetails.maxOrderQty
      ) {
        setSnackbar({
          open: true,
          message: "Maximum quantity of 6 reached for this product.",
          severity: "error",
        });
        return;
      }

      const response: any = await executePatch(increaseCartItem, {
        cartItemId: cartItemId,
      });

      if (response.username) {
        setSnackbar({
          open: true,
          message: "Product quantity increased successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to increase product quantity. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to increase product quantity. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDecrement = async (cartItemId: number): Promise<void> => {
    try {
      const response: any = await executePatch(decreaseCartItem, {
        cartItemId: cartItemId,
      });

      if (response.username) {
        setSnackbar({
          open: true,
          message: "Product quantity decreased successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to decrease product quantity. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to decrease product quantity. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      const response: any = await executeDelete(deleteCartItem, {
        cartItemId: itemId,
      });

      if (count !== 1) {
        await dispatch(getCartAsync({ username: username }));
      } else {
        dispatch(clearCart());
      }

      if (DeleteItemError) {
        setSnackbar({
          open: true,
          message: "Failed to remove product from cart. Please try again!",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Product removed from cart successfully!",
          severity: "success",
        });
        setCount(0);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to remove product from cart. Please try again!",
        severity: "error",
      });
    }
  };

  const handleShare = async () => {
    const response: any = await executePost(share_product, {
      itemSlug: ItemDetails?.itemSlug,
    });
    setSharableData(response.content);
  };

  useEffect(() => {
    if (shareOpen) {
      handleShare();
    }
  }, [shareOpen]);

  const handleVariantChange = async (
    producrId: number,
    keyName: string,
    keyValue: string
  ) => {
    try {
      const response = await getVariantService(producrId, keyName, keyValue);
      setItemDetails(response);
      if (response?.itemSlug) {
        navigate(`/product/${response.itemSlug}`);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
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

    setAnchorEl(anchorEl ? null : event.currentTarget);
    dispatch(getWishlistAsync({ username }));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBuyNow = async () => {
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

    if (isItemInCart) {
      navigate("/cart/bag");
    } else {
      await hadleAddToCart();
      navigate("/cart/bag");
    }
  };

  const handleWishlistClick = (wishlistName: string) => {
    if (!ItemDetails) return;

    setSelectedWishlist(wishlistName);
    setSelectedProduct({
      title: ItemDetails?.itemTitle,
      image: ItemDetails?.itemGallery?.[0]?.fileUrl || "",
    });
    setShowModal(true);
    handleClose();
  };

  const open = Boolean(anchorEl);

  const hadleAddToCart = async () => {
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

    if (ItemDetails && ItemDetailsInitial) {
      const addToCartData: AddToCartRequest = {
        username: username,
        productCode: ItemDetails?.productCode,
        itemId: ItemDetails?.itemPricing.itemId,
        qty: ItemDetailsInitial.minOrderQty,
        imageUrl: ItemDetails?.itemGallery?.[0]?.fileUrl || "",
      };

      try {
        await dispatch(addToCartAsync(addToCartData));
        setSnackbar({
          open: true,
          message:
            ItemDetailsInitial.minOrderQty > 1
              ? `Minimum quantity is ${ItemDetailsInitial.minOrderQty}. We've added ${ItemDetailsInitial.minOrderQty} items to your cart.`
              : "Product has been added to cart",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to add the product to the cart. Please try again! ",
          severity: "error",
        });
      }
    }
  };

  const currentItem = ItemDetails ? ItemDetails?.itemPricing?.itemId : null;
  const defaultImg = ItemDetails?.itemGallery.find(
    (each) => (each.isDefault && each?.fileUrl) || ""
  );

  return (
    <div className="p-0" style={{ position: "relative" }}>
      <div className="p-0">
        {ItemDetails && (
          <>
            <div className="container-fluid mb-0 mb-md-5 p-0">
              <Box
                sx={{ py: 2, mt: { xs: 0, md: 2, lg: 4 } }}
                mb={{ xs: 0, lg: 0 }}
              >
                <Grid container spacing={{ xs: 1, sm: 1, md: 0 }}>
                  {/* Image Gallery - Thumbnails */}
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    md={2}
                    lg={2}
                    order={{ xs: 2, sm: 1 }}
                  >
                    <Box
                      sx={{
                        maxHeight: {
                          xs: "auto",
                          sm: "350px",
                          md: "450px",
                          lg: "500px",
                        },
                        width: {
                          xs: "100%",
                          sm: "auto",
                          md: "auto",
                          lg: "auto",
                        },
                        overflowY: { sm: "auto", md: "auto" },
                        overflowX: { xs: "auto", sm: "hidden", md: "hidden" },
                        display: "flex",
                        flexDirection: { xs: "row", sm: "column" },
                        alignItems: { xs: "center", sm: "end" },
                        flexWrap: "nowrap",
                        gap: { xs: 0.5, sm: 1, md: 1.5 },
                      }}
                      className="gallery-container hide-scrollbars"
                    >
                      {Array.isArray(ItemDetails?.itemGallery) &&
                        ItemDetails.itemGallery.map((gallery, idx) => (
                          <Button
                            key={gallery.id}
                            sx={{
                              padding: "0px",
                              width: {
                                xs: "80px",
                                sm: "100px",
                                md: "120px",
                                lg: "156px",
                              },
                              height: {
                                xs: "80px",
                                sm: "100px",
                                md: "120px",
                                lg: "156px",
                              },
                              flexShrink: 0,
                              mb: { xs: 0, sm: 0, md: 0 },
                              mx: { xs: 0.5, sm: 0, md: 0 },
                              ml: {
                                xs: idx === 0 ? 1.5 : 0,
                                sm: 0,
                                md: 0,
                                lg: 0,
                              },
                              mr: {
                                xs:
                                  idx === ItemDetails.itemGallery.length - 1
                                    ? 1.5
                                    : 1.2,
                                sm: 0,
                                md: 0,
                                lg: 0,
                              },
                              border:
                                mainImage === gallery.fileUrl
                                  ? "2px solid #334f3e"
                                  : "1px solid #e0e0e0",
                              borderRadius: 2,
                            }}
                            onClick={() => handleImges(gallery.fileUrl)}
                          >
                            <img
                              src={gallery?.fileUrl || "/placeholder.svg"}
                              alt={`Gallery-Image ${idx}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 6,
                                objectFit: "cover",
                              }}
                            />
                          </Button>
                        ))}
                    </Box>
                  </Grid>

                  {/* Main Product Image */}
                  <Grid
                    order={{ xs: 1, sm: 2 }}
                    item
                    sx={{
                      pl: {
                        xs: "0 !important",
                        sm: "8px !important",
                        md: "12px !important",
                        lg: "16px !important",
                      },
                      pr: {
                        xs: "0 !important",
                        sm: "8px !important",
                        md: "12px !important",
                        lg: "16px !important",
                      },
                    }}
                    xs={12}
                    sm={5}
                    md={5}
                    lg={4}
                  >
                    <Box
                      px={{ xs: 2, sm: 1, md: 2 }}
                      sx={{
                        backgroundImage: `url(${
                          mainImage || defaultImg?.fileUrl
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        minHeight: {
                          xs: "300px",
                          sm: "350px",
                          md: "400px",
                          lg: "500px",
                        },
                        width: { xs: "100%", sm: "100%", md: "100%" },
                        borderRadius: { xs: 0, sm: 1, md: 2 },
                        position: "relative",
                      }}
                    >
                      {/* Share Button */}
                      <Box
                        position="absolute"
                        ref={shareRef}
                        top={{ xs: 8, sm: 12, md: 16 }}
                        right={{ xs: 8, sm: 12, md: 16 }}
                        display="inline-block"
                      >
                        <IconButton
                          color="primary"
                          onClick={() => setShareOpen((prev) => !prev)}
                          sx={{
                            bgcolor: "#fff",
                            width: { xs: 36, sm: 40, md: 44 },
                            height: { xs: 36, sm: 40, md: 44 },
                            zIndex: 10,
                            "&:hover": {
                              backgroundColor: "#fff",
                            },
                          }}
                        >
                          <ShareIcon
                            sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }}
                          />
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
                            top={48}
                            right={0}
                            boxShadow={3}
                            borderRadius={2}
                            zIndex={20}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EmailShareButton
                              url={sharableData.url}
                              subject={sharableData.title || ""}
                              body={sharableData.description}
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
                              <XIcon sx={{ fontSize: 24 }} />
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
                  </Grid>

                  {/* Product Details */}
                  <Grid
                    order={{ xs: 3, sm: 3 }}
                    item
                    xs={12}
                    sm={5}
                    md={5}
                    lg={6}
                    pt={{ xs: "0 !important", sm: "auto", md: "auto" }}
                  >
                    <CardContent
                      sx={{
                        pt: { xs: "0 !important", sm: "auto", md: "auto" },
                        p: { xs: 1, sm: 1 },
                      }}
                    >
                      {/* Product Title */}
                      <Typography
                        fontSize={{
                          xs: "18px",
                          sm: "20px",
                          md: "24px",
                          lg: "28px",
                        }}
                        fontWeight={600}
                        mb={{ xs: 1, sm: 1.5, md: 2 }}
                        lineHeight={1.3}
                      >
                        {ItemDetails?.itemTitle}
                      </Typography>

                      {/* Price Section */}
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={{ xs: 1, sm: 1.5, md: 2 }}
                        mb={{ xs: 1, sm: 1.5, md: 2 }}
                        flexWrap="wrap"
                      >
                        <Typography
                          color="#5a3e1b"
                          fontWeight={600}
                          fontSize={{
                            xs: "16px",
                            sm: "18px",
                            md: "24px",
                            lg: "28px",
                          }}
                        >
                          {symbol}
                          {"\u200A"}
                          {ItemDetails?.itemPricing?.price}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="gray"
                          fontSize={{ xs: "12px", sm: "13px", md: "14px" }}
                        >
                          MRP: {"\u200A"}
                          <s>
                            {symbol}
                            {"\u200A"}
                            {ItemDetails?.itemPricing.mrp}
                          </s>
                        </Typography>

                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{
                            fontSize: { xs: "9px", sm: "10px", md: "11px" },
                            minWidth: { xs: "auto", sm: "auto", md: "auto" },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            "&:hover": {
                              cursor: "default",
                              backgroundColor: "success.main",
                              boxShadow: "none",
                            },
                          }}
                        >
                          {ItemDetails?.itemPricing?.discount}%
                        </Button>
                      </Box>

                      {/* Stock Alert */}
                      {ItemDetails?.minStockAlert && (
                        <Box
                          display="flex"
                          alignItems="center"
                          pb={{ xs: 1, sm: 1.5, md: 2 }}
                        >
                          <Box
                            sx={{
                              width: { xs: 16, sm: 18, md: 20 },
                              height: { xs: 16, sm: 18, md: 20 },
                              bgcolor: "rgba(244, 67, 54, 0.1)",
                              borderRadius: "50%",
                              mr: 1,
                            }}
                            className="d-flex flex-row align-items-center justify-content-center"
                          >
                            <Box
                              sx={{
                                width: { xs: 6, sm: 7, md: 8 },
                                height: { xs: 6, sm: 7, md: 8 },
                                bgcolor: "error.main",
                                borderRadius: "50%",
                              }}
                            />
                          </Box>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: {
                                xs: "0.7rem",
                                sm: "0.8rem",
                                md: "0.9rem",
                              },
                            }}
                            color="error.main"
                          >
                            Hurry, Only {ItemDetails?.availableStock} left!
                          </Typography>
                        </Box>
                      )}

                      {/* Variants */}
                      <Grid
                        container
                        spacing={{ xs: 1, sm: 1.5, md: 2 }}
                        mb={{ xs: 2, sm: 2.5, md: 3 }}
                      >
                        {ItemDetails?.variants?.map((variant, index) => (
                          <Grid item xs={12} key={index}>
                            <Typography
                              fontWeight={500}
                              mb={0.5}
                              fontSize={{ xs: "14px", sm: "15px", md: "16px" }}
                            >
                              {variant.keyName}:
                            </Typography>
                            <Box
                              display="flex"
                              flexWrap="wrap"
                              gap={{ xs: 0.5, sm: 1, md: 1 }}
                            >
                              {variant.variantSpecValues.map((each) => (
                                <Button
                                  key={each.itemId}
                                  variant="outlined"
                                  sx={{
                                    textTransform: "none",
                                    boxShadow: "none",
                                    border:
                                      currentItem === each.itemId
                                        ? "1px solid #f1eae4"
                                        : "1px solid #1E2624",
                                    bgcolor:
                                      currentItem === each.itemId
                                        ? "#f1eae4"
                                        : "#fff",
                                    color: (theme) =>
                                      theme.palette.success.main,
                                    fontSize: {
                                      xs: "10px",
                                      sm: "11px",
                                      md: "13px",
                                    },
                                    px: { xs: 1, sm: 1.2, md: 1.3 },
                                    py: { xs: 0.2, sm: 0.3, md: 0.3 },
                                    minWidth: { xs: 40, sm: 44, md: 48 },
                                    height: { xs: 28, sm: 32, md: 36 },
                                  }}
                                  onClick={() =>
                                    handleVariantChange(
                                      variant.productId,
                                      variant.keyName,
                                      each.keyValue
                                    )
                                  }
                                >
                                  {each.keyValue}
                                </Button>
                              ))}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Fixed: Quantity Selector and Add to Cart */}
                      <Grid
                        sx={{
                          maxWidth: {
                            xs: "100%",
                            sm: "100%",
                            md: "85%",
                            lg: "75%",
                          },
                        }}
                        container
                        spacing={{ xs: 1, sm: 1.5, md: 2 }}
                        mb={{ xs: 2, sm: 2.5, md: 3 }}
                      >
                        {/* Quantity Selector - Only show when item is in cart */}
                        {isItemInCart && (
                          <Grid item xs={5} sm={5} md={5} lg={4}>
                            <Box
                              display="flex"
                              justifyContent="space-around"
                              alignItems="center"
                              border="1px solid #334f3e"
                              borderRadius={1}
                              height={{ xs: 36, sm: 38, md: 40 }}
                              width="100%"
                            >
                              <Button
                                onClick={() => {
                                  if (
                                    count !== ItemDetails?.minOrderQty &&
                                    isCartItem
                                  ) {
                                    handleDecrement(isCartItem.id);
                                  } else if (isCartItem) {
                                    handleDeleteItem(isCartItem.id);
                                  }
                                }}
                                sx={{
                                  color: "#334f3e",
                                  minWidth: { xs: 28, sm: 32, md: 36 },
                                  p: 0,
                                }}
                              >
                                {count === ItemDetails?.minOrderQty ? (
                                  <img
                                    src={"/placeholder.svg"}
                                    alt="delete"
                                    style={{ width: 16 }}
                                  />
                                ) : (
                                  <RemoveSharpIcon
                                    sx={{
                                      fontSize: { xs: 16, sm: 18, md: 20 },
                                    }}
                                  />
                                )}
                              </Button>

                              <Typography
                                px={{ xs: 0.5, sm: 1, md: 2 }}
                                fontSize={{
                                  xs: "13px",
                                  sm: "14px",
                                  md: "14px",
                                }}
                              >
                                {count}
                              </Typography>

                              <Button
                                disabled={count === ItemDetails?.maxOrderQty}
                                onClick={() => {
                                  if (isCartItem) {
                                    handleIncrement(isCartItem.id, count);
                                  }
                                }}
                                sx={{
                                  color: "#334f3e",
                                  minWidth: { xs: 28, sm: 32, md: 36 },
                                  p: 0,
                                }}
                              >
                                <AddIcon
                                  sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
                                />
                              </Button>
                            </Box>
                          </Grid>
                        )}

                        {/* Add to Cart Button */}

                        <Grid item xs={7} sm={7} md={7} lg={5}>
                          {!isItemInCart && (
                            <motion.div
                              key={isItemInCart ? "increment" : "add"}
                              initial={{ y: "5%", opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: "5%", opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Button
                                onClick={() => {
                                  if (isItemInCart && isCartItem) {
                                    handleIncrement(isCartItem.id, count);
                                  } else {
                                    hadleAddToCart();
                                  }
                                }}
                                variant="outlined"
                                fullWidth
                                sx={{
                                  boxShadow: "none",
                                  border: "1px solid #334f3e",
                                  bgcolor: "#334f3e",
                                  color: "#fff",
                                  height: { xs: 36, sm: 38, md: 40 },
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: {
                                    xs: "10px",
                                    sm: "10px",
                                    md: "14px",
                                  },
                                  gap: { xs: 0.5, sm: 1, md: 1 },
                                  "&:hover": {
                                    boxShadow: "none",
                                    bgcolor: "#2a3f2e",
                                  },
                                }}
                              >
                                Add to Cart
                                <ShoppingCartIcon
                                  sx={{
                                    fontSize: { xs: 12, sm: 14, md: 20 },
                                  }}
                                />
                              </Button>
                            </motion.div>
                          )}
                        </Grid>
                      </Grid>

                      {/* Buy Now and Wishlist */}
                      <Grid
                        container
                        spacing={{ xs: 1, sm: 1.5, md: 2 }}
                        mb={{ xs: 2, sm: 3, md: 4 }}
                        sx={{
                          maxWidth: {
                            xs: "100%",
                            sm: "100%",
                            md: "85%",
                            lg: "75%",
                          },
                        }}
                      >
                        <Grid item xs={5} sm={5} md={5} lg={4}>
                          <Button
                            onClick={handleBuyNow}
                            fullWidth
                            variant="outlined"
                            sx={{
                              height: { xs: 36, sm: 38, md: 40 },
                              color: "#334f3e",
                              borderColor: "#334f3e",
                              fontSize: { xs: "11px", sm: "12px", md: "14px" },
                              "&:hover": {
                                backgroundColor: "#334f3e",
                                color: "#fff",
                              },
                            }}
                          >
                            BUY NOW
                          </Button>
                        </Grid>

                        <Grid item xs={7} sm={7} md={6} lg={4}>
                          <Button
                            sx={{
                              color: "#334f3e",
                              px: { xs: "auto", sm: 0.7, md: "auto" },
                              borderColor: "#334f3e",
                              justifyContent: "space-around",
                              textTransform: "none",
                              height: { xs: 36, sm: 38, md: 40 },
                              fontSize: { xs: "11px", sm: "12px", md: "14px" },
                              "&:hover": {
                                backgroundColor: "#334f3e",
                                color: "#fff",
                              },
                            }}
                            variant="outlined"
                            fullWidth
                            onClick={handleClick}
                            endIcon={
                              open ? (
                                <ExpandLessIcon
                                  sx={{
                                    fontSize: { xs: 12, sm: 14, md: 20 },
                                  }}
                                />
                              ) : (
                                <ExpandMoreIcon
                                  sx={{
                                    fontSize: { xs: 12, sm: 14, md: 20 },
                                  }}
                                />
                              )
                            }
                          >
                            Add to Wishlist
                          </Button>

                          <Popper
                            open={open}
                            anchorEl={anchorEl}
                            placement="bottom-start"
                            transition
                            disablePortal={false}
                            modifiers={[
                              {
                                name: "offset",
                                options: {
                                  offset: [0, 8],
                                },
                              },
                            ]}
                          >
                            {({ TransitionProps }) => (
                              <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: "top left" }}
                              >
                                <Paper
                                  sx={{
                                    mt: 1,
                                    p: 1,
                                    width: { xs: 220, sm: 240, md: 260 },
                                    borderRadius: 2,
                                    boxShadow: 3,
                                  }}
                                >
                                  <ClickAwayListener onClickAway={handleClose}>
                                    <List>
                                      {wishlists.map((wishlist) => (
                                        <ListItem
                                          key={wishlist.id}
                                          component="div"
                                          sx={{
                                            "&:hover": {
                                              backgroundColor: "#f0f0f0",
                                            },
                                            py: 0.2,
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            handleWishlistClick(wishlist.name)
                                          }
                                        >
                                          <ListItemText
                                            primary={wishlist.name}
                                            primaryTypographyProps={{
                                              fontSize: {
                                                xs: "0.8rem",
                                                sm: "0.875rem",
                                              },
                                            }}
                                            sx={{ cursor: "pointer" }}
                                          />
                                        </ListItem>
                                      ))}
                                      <Divider sx={{ my: 0 }} />
                                      <ListItem
                                        component="div"
                                        sx={{
                                          cursor: "pointer",
                                          "&:hover": {
                                            backgroundColor: "#f0f0f0",
                                          },
                                          py: 0.2,
                                          pl: 2,
                                          pr: 1,
                                          px: 0.6,
                                        }}
                                        onClick={openDrawer}
                                      >
                                        <AddCircleOutlineOutlinedIcon
                                          sx={{ fontSize: "15px", mr: 0.4 }}
                                        />
                                        <ListItemText
                                          primary="Create Another Wish List"
                                          primaryTypographyProps={{
                                            fontSize: {
                                              xs: "0.8rem",
                                              sm: "0.875rem",
                                            },
                                          }}
                                        />
                                      </ListItem>
                                    </List>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper>
                        </Grid>
                      </Grid>

                      {/* Delivery Section */}
                      <Box
                        sx={{
                          p: { xs: 1.5, sm: 2, md: 2.5 },
                          border: "2px solid #F1EAE4",
                          borderRadius: 2,
                          maxWidth: {
                            xs: "100%",
                            sm: "100%",
                            md: "90%",
                            lg: "75%",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: { xs: 1, sm: 1.5, md: 2 },
                            flexWrap: "wrap",
                            rowGap: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.85rem",
                                md: "1rem",
                              },
                            }}
                          >
                            Delivery Options
                            {pincode && (
                              <Box
                                sx={{
                                  backgroundColor: "#F1EAE4",
                                  px: { xs: 1, sm: 1, md: 1.5 },
                                  py: { xs: 0.4, sm: 0.5, md: 0.7 },
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: {
                                    xs: "0.7rem",
                                    sm: "0.7rem",
                                    md: "0.85rem",
                                  },
                                  fontWeight: 500,
                                }}
                              >
                                <FmdGoodOutlinedIcon
                                  fontSize="small"
                                  sx={{
                                    mr: 0.5,
                                    fontSize: { xs: 14, sm: 16, md: 18 },
                                  }}
                                />
                                {pincode}
                              </Box>
                            )}
                          </Typography>

                          <Typography
                            onClick={handleChooseLocation}
                            sx={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              fontWeight: 500,
                              fontSize: {
                                xs: "0.75rem",
                                sm: "0.8rem",
                                md: "0.9rem",
                              },
                            }}
                          >
                            {pincode ? "Change" : "Enter Pincode"}
                            <ChevronRightOutlinedIcon
                              sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
                            />
                          </Typography>
                        </Box>

                        {expectedDate && (
                          <Box
                            sx={{
                              mt: { xs: 1, sm: 1.5, md: 2 },
                              backgroundColor: "#F1EAE4",
                              py: { xs: 1, sm: 1.2, md: 1.5 },
                              borderRadius: 1.5,
                            }}
                            className="d-flex ps-3 flex-row gap-2 justify-content-start align-items-center"
                          >
                            <Box>
                              <LocalShippingOutlinedIcon
                                sx={{
                                  color: "#334F3E",
                                  fontSize: { xs: 18, sm: 20, md: 22 },
                                }}
                              />
                            </Box>

                            <Box>
                              <Typography
                                variant="body2"
                                color="#121926"
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    sm: "0.8rem",
                                    md: "0.9rem",
                                  },
                                }}
                              >
                                <span
                                  style={{
                                    color: "#334F3E",
                                    fontWeight: "600",
                                  }}
                                >
                                  Free Delivery
                                </span>{" "}
                                - Get it by{" "}
                                {new Date(expectedDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Box>
            </div>

            {/* Ingredients Section */}
            <div className="w-100">
              {ItemDetails.ingredients?.length > 0 && (
                <Ingredients
                  ingredients={
                    ItemDetails.ingredients ? ItemDetails.ingredients : []
                  }
                />
              )}
            </div>

            {/* Specifications Section */}
            <Box
              className="container"
              sx={{
                margin: "auto",
                padding: { xs: 2, sm: 2.5, md: 3, lg: 0 },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={() => setShowSpecifications((prev) => !prev)}
                    variant="h6"
                    fontWeight="bold"
                    fontSize={{ xs: "1rem", sm: "1.1rem", md: "1.25rem" }}
                  >
                    SPECIFICATIONS
                  </Typography>
                </Box>

                <Box onClick={() => setShowSpecifications((prev) => !prev)}>
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: (theme) => theme.palette.success.main,
                      color: "#fff",
                      borderRadius: "50%",
                      width: { xs: "28px", sm: "30px", md: "32px" },
                      height: { xs: "28px", sm: "30px", md: "32px" },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.success.main,
                        color: "#fff",
                      },
                    }}
                  >
                    {showSpecifications ? (
                      <ExpandLess
                        sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }}
                      />
                    ) : (
                      <ExpandMore
                        sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }}
                      />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={showSpecifications}>
                {ItemDetails?.itemSpecs?.length > 0 &&
                  ItemDetails?.itemSpecs.map((each) => (
                    <Box key={each.id} className="mt-2">
                      <ul>
                        <li style={{ fontSize: "14px" }}>
                          {each?.keyName} : {each?.keyValue}
                        </li>
                      </ul>
                    </Box>
                  ))}
              </Collapse>

              <Divider sx={{ mt: 2 }} />
            </Box>

            {/* Review Section */}
            <ReviewSection
              productReviews={ItemDetails?.productReviews}
              description={ItemDetails?.description}
              productImage={ItemDetails?.itemGallery?.[0]?.fileUrl}
              productId={ItemDetails?.productId}
              slug={ItemDetails.itemSlug}
              itemDetails={ItemDetails}
              productData={ItemDetails.productData}
              productCode={ItemDetails.productCode}
            />
          </>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar?.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbar?.severity}
            sx={{ width: "100%" }}
          >
            {snackbar?.message}
          </MuiAlert>
        </Snackbar>

        {/* Drawers and Modals */}
        <ChooseLocationDrawer
          open={isChooseLocationOpen}
          onClose={() => {
            setIsChooseLocationOpen(false);
            dispatch(addSticky());
          }}
          onConfirmDelivery={(info) => {
            handleConfirmDelivery(info);
          }}
        />

        <AddToWishlistModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
          }}
          wishlistName={selectedWishlist}
          product={selectedProduct}
          wishlists={wishlists}
          productCard={{
            productId: null,
            itemId: ItemDetails?.itemPricing?.itemId ?? 0,
            productCode: ItemDetails?.productCode || "",
            itemSlug: ItemDetails?.itemSlug || "",
            productSlug: "",
            productTitle: ItemDetails?.relatedProducts?.[0]?.productTitle || "",
            itemTitle: ItemDetails?.itemTitle || "",
            itemImage: ItemDetails?.itemGallery?.[0]?.fileUrl || "",
            itemMrp: ItemDetails?.itemPricing?.mrp ?? 0,
            itemPrice: ItemDetails?.itemPricing?.price ?? 0,
            itemDiscount: ItemDetails?.itemPricing?.discount ?? 0,
          }}
        />

        <CustomDrawer open={drawerOpen} onClose={closeDrawer} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          className="d-flex flex-row justify-content-center align-items-center"
          style={{ height: "90vh" }}
        >
          <CircularProgress />
        </div>
      )}

      {/* Error State */}
      {(error || !ItemDetails) && (
        <div
          className="d-flex flex-row justify-content-center align-items-center"
          style={{ height: "90vh" }}
        >
          <h4>Data not found</h4>
        </div>
      )}

      {/* Related Products */}
    </div>
  );
};

export default ProductDetailCard;
