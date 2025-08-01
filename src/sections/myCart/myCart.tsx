import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Modal,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./css/myCart.css";
import { useDispatch } from "react-redux";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import Trash from "../../assets/media/icons/trash.svg";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store/store";
import type { Cart } from "../addToBag/model/cart";
import { clearCart, getCartAsync } from "../../Redux/slices/addToCart";
import { useDeleteByParams } from "../../customHooks/useDeleteByParams";
import {
  clearCartUri,
  decreaseCartItem,
  deleteCartItem,
  increaseCartItem,
} from "./service/myCartService";
import AddIcon from "@mui/icons-material/Add";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { usePatchByParams } from "../../customHooks/usePatchByParams";
import CartIsEmptyPage from "../../utils/notFound/cartIsEmpty";
import { ProductStatusType } from "../inventoryProduct/enum/productStatusType";
import Tooltip from "@mui/material/Tooltip";
import { ProductStatusTypeDisplay } from "../inventoryProduct/enum/productStatusType";
import CartRelatedProducts from "./cartRelatedProducts";
import { getDefaultWishlistAsync } from "../../Redux/slices/wishListSlice";
import { CartItems } from "../addToBag/model/cartItems";
import { clearLocalText } from "../../web-constants/constants";
import { selectCurrencySymbol } from "../../Redux/slices/currencySlice";

const MyCart = () => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [outOfStockItemsCount, setOutOfStockItemsCount] = useState<number>(0);
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false);
  const symbol = useSelector(selectCurrencySymbol);
  const dispatch = useDispatch<AppDispatch>();
  const cart: Cart = useSelector((store: RootState) => store.cart.cart);
  const cartLoading = useSelector((store: RootState) => store.cart.status);
  const username = useSelector((store: RootState) => store.jwtToken.username);
  const { data, loading, error, executeDelete } = useDeleteByParams<Cart>();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });

  const {
    data: incDecData,
    loading: incDecLoading,
    error: incDecError,
    executePatch,
  } = usePatchByParams();

  const [open, setOpen] = useState(false);
  const handleOpenModel = () => setOpen(true);
  const handleCloseModel = () => setOpen(false);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showDrawer = () => {
    setDrawerVisible(true);
    dispatch(removeSticky());
  };

  useEffect(() => {
    dispatch(getCartAsync({ username: username }));
    dispatch(getDefaultWishlistAsync({ username: username }));
  }, [dispatch, username]);

  useEffect(() => {
    if (data) {
      dispatch(getCartAsync({ username: username }));
    }
  }, [data, dispatch, username, incDecData]);

  const handleClose = () => {
    setDrawerVisible(false);
    dispatch(addSticky());
  };

  const handleIncrement = async (
    itemId: number,
    qty: number
  ): Promise<void> => {
    try {
      setOpen(true);
      if (qty >= 6) {
        setOpen(false);
        setSnackbar({
          open: true,
          message: "Maximum quantity of 6 reached for this product.",
          severity: "error",
        });
        return;
      }

      const response: any = await executePatch(increaseCartItem, {
        cartItemId: itemId,
      });
      setOpen(false);
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
      setOpen(false);
      setSnackbar({
        open: true,
        message: "Failed to increase product quantity. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDecrement = async (itemId: number): Promise<void> => {
    try {
      setOpen(true);
      const response: any = await executePatch(decreaseCartItem, {
        cartItemId: itemId,
      });
      setOpen(false);

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
      setOpen(false);
      setSnackbar({
        open: true,
        message: "Failed to decrease product quantity. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      setOpen(true);
      await executeDelete(deleteCartItem, { cartItemId: itemId });

      if (cart.totalItems !== 1) {
        await dispatch(getCartAsync({ username: username }));
        setOpen(false);
      } else {
        dispatch(clearCart());
        setOpen(false);
      }
      if (!error) {
        setSnackbar({
          open: true,
          message: "Product removed from cart successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to remove product from cart. Please try again!",
          severity: "error",
        });
      }
    } catch (error) {
      setOpen(false);
      setSnackbar({
        open: true,
        message: "Failed to remove product from cart. Please try again!",
        severity: "error",
      });
    }
  };

    const handleCheckout = async () => {
      if (outOfStockItemsCount) {
        setOpen(true);
        setIsOutOfStock(true);
        return;
      } else {
        clearLocalText("orderNum")
        navigate("/cart/bag/checkout");
      }
    };

  const cartItemSlugs = useMemo(() => {
    if (cart?.cartItems?.length > 0) {
      return cart.cartItems
        .map((item) => item?.productCard?.itemSlug)
        .filter((slug): slug is string => typeof slug === "string");
    }
    return [];
  }, [cart]);

  console.log("relatedProductsSlugs", cartItemSlugs);

  useEffect(() => {
    if (cart?.cartItems?.length > 0) {
      const count = cart.cartItems.reduce(
        (acc, item) =>
          item.productCard?.itemStatus !== ProductStatusType.ACTIVE ||
          item.productCard?.productStatus !== ProductStatusType.ACTIVE
            ? acc + 1
            : acc,
        0
      );
      setOutOfStockItemsCount(count);
    }
  }, [cart?.cartItems]);

  console.log("outOfStockItemsCount", outOfStockItemsCount);

  const handleClearCart = async () => {
    try {
      setOpen(true);
      const response: any = await executeDelete(clearCartUri, { username });
      console.log("responce cart clear", response);

      if (response) {
        dispatch(clearCart());

        setSnackbar({
          open: true,
          message: response.message || "Cart cleared successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message:
            response?.message || "Failed to clear cart. Please try again!",
          severity: "error",
        });
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          err?.message || "Something went wrong while clearing the cart.",
        severity: "error",
      });
    } finally {
      setOpen(false); // Stop loading
    }
  };

  // const hasItems =
  //   cart && cart.cartItems && cart.cartItems.length > 0 && data !== null;

  const hasItems = (cart?.cartItems?.length ?? 0) > 0 && data != null;

  return (
    // <Container maxWidth="xl" sx={{ pb: 4 }}>
    <div className="container px-0 px-md-5">
      <Box>
        {hasItems ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  py: 1,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #F1EAE4",
                  borderRadius: "8px",
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  fontSize: { sx: "12px", md: "20px" },
                  backgroundColor: (theme) => theme.palette.info.main,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* <Typography sx={{ mr: 1 }}>
                    Deliver to : Hyderabad - 500008
                  </Typography> */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 500,
                      color: (theme) => theme.palette.success.main,
                      mt: 0.6,
                      fontSize: { sx: "12px", md: "20px" },
                    }}
                  >
                    My Cart ({cart.totalItems} items in your cart)
                  </Typography>
                </Box>
                {/* <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: "#333", borderColor: "#333" }}
                >
                  Change
                </Button> */}
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1, md: 3 },
                  pt: { xs: 1, md: 2 },
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  border: "2px solid #F1EAE4",
                }}
              >
                {/* <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#1a1a1a" }}
                >
                  My Cart ({cart.totalItems} items in your cart)
                </Typography> */}

                {cart.cartItems.map((item: CartItems) => (
                  <>
                    {item.productCard?.itemStatus ===
                      ProductStatusType.ACTIVE &&
                      item.productCard?.productStatus ===
                        ProductStatusType.ACTIVE && (
                        <Card
                          key={item.id}
                          sx={{
                            mb: 2,
                            border: "1px solid #f0f0f0",
                            boxShadow: "none",
                            borderRadius: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", p: { xs: 1, md: 2 } }}>
                            <Box>
                              <Link
                                to={`/product/${item.productCard?.itemSlug}`}
                                className="router-link"
                              >
                                <Box
                                  component="img"
                                  src={
                                    item.productCard?.itemImage ||
                                    "/placeholder.svg"
                                  }
                                  alt={item.productCard?.itemTitle}
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                  }}
                                />
                              </Link>
                            </Box>
                            <Box sx={{ flex: 1, ml: { xs: 1, md: 3 } }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: { xs: "1rem", md: "1.1rem" },
                                    fontWeight: 500,
                                  }}
                                >
                                  <Link
                                    to={`/product/${item.productCard?.itemSlug}`}
                                    style={{
                                      color: "inherit",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {item.productCard?.itemTitle}
                                  </Link>
                                </Typography>

                                <IconButton
                                  onClick={() => handleDeleteItem(item.id)}
                                  sx={{
                                    color: "#666",
                                    display: { xs: "none", md: "block" },
                                  }}
                                >
                                  <img
                                    src={Trash}
                                    alt="delete"
                                    style={{ width: 20 }}
                                  />
                                </IconButton>
                              </Box>

                              {item.productCard?.minStockAlert && (
                                <Box display="flex" alignItems="center">
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      bgcolor: "rgba(244, 67, 54, 0.1)",
                                      borderRadius: "50%",
                                      mr: 1,
                                    }}
                                    className="d-flex flex-row align-items-center justify-content-center"
                                  >
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        bgcolor: "error.main",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: { xs: "0.7rem", md: "0.9rem" },
                                    }}
                                    color="error.main"
                                  >
                                    Hurry, Only{" "}
                                    {item.productCard.availableStock} left!
                                  </Typography>
                                </Box>
                              )}

                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: !item.productCard?.returnAllowed
                                    ? "red"
                                    : " ",
                                }}
                              >
                                {!item.productCard?.returnAllowed &&
                                  "Not Returnable"}
                              </Typography>

                              <Box
                                sx={{
                                  mt: 2,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {/* alskjdfahlks */}
                                <Box
                                  sx={{
                                    display: { xs: "none", md: "flex" },
                                    alignItems: "center",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 1,
                                    bgcolor: "#f8f9fa",
                                  }}
                                >
                                  {item?.qty === item?.productCard?.minQty ? (
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteItem(item.id)}
                                      sx={{ color: "#ff4444" }}
                                    >
                                      <img
                                        src={Trash}
                                        alt="delete"
                                        style={{ width: 16 }}
                                      />
                                    </IconButton>
                                  ) : (
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDecrement(item.id)}
                                    >
                                      <RemoveSharpIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                  <Typography
                                    sx={{
                                      mx: 2,
                                      minWidth: 20,
                                      textAlign: "center",
                                    }}
                                  >
                                    {item.qty}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleIncrement(item.id, item.qty)
                                    }
                                    disabled={item.qty >= 6}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>

                                <Box sx={{ ml: { sx: 0, md: 3 } }}>

                                   <Typography
                                    component="span"
                                    sx={{
                                      fontSize: "1.1rem",
                                      fontWeight: 500,
                                      color: "#2c3e50",
                                    }}
                                  >
                                    {symbol}{"\u200A"}
                                    {item.totalPrice}
                                  </Typography>{"  "}

                                  <Typography
                                    component="span"
                                    sx={{
                                      textDecoration: "line-through",
                                      color: "#ff4444",
                                      mr: { xs: 1, md: 1 },
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    MRP: {symbol}{"\u200A"}
                                    {item?.productCard &&
                                      item?.productCard?.itemMrp * item.qty}
                                  </Typography>
                                  <Typography
                                    component="span"
                                    sx={{
                                      color: "#43a047", 
                                      fontSize: "0.9rem",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {item?.productCard.itemDiscount}{"%"}
                                  </Typography>
                                 
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Box className="h-100 px-2 pb-2 d-flex flex-row justify-content-start align-items-center">
                            <Box
                              sx={{
                                display: { xs: "flex", md: "none" },
                                alignItems: "center",
                                border: "1px solid #e0e0e0",
                                borderRadius: 1,
                                bgcolor: "#f8f9fa",
                                width: "auto",
                                mt: 1,
                              }}
                            >
                              {item?.qty === item?.productCard?.minQty ? (
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteItem(item.id)}
                                  sx={{ color: "#ff4444" }}
                                >
                                  <img
                                    src={Trash}
                                    alt="delete"
                                    style={{ width: 16 }}
                                  />
                                </IconButton>
                              ) : (
                                <IconButton
                                  size="small"
                                  onClick={() => handleDecrement(item.id)}
                                >
                                  <RemoveSharpIcon fontSize="small" />
                                </IconButton>
                              )}
                              <Typography
                                sx={{
                                  mx: 2,
                                  minWidth: 20,
                                  textAlign: "center",
                                }}
                              >
                                {item.qty}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleIncrement(item.id, item.qty)
                                }
                                disabled={item.qty >= 6}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Button
                              onClick={() => handleDeleteItem(item.id)}
                              sx={{
                                color: (theme) => theme.palette.success.main,
                                fontSize: "0.8rem",
                                "&:hover": {
                                  color: "#ff4444",
                                },
                                mt: 1,
                                ml: 1,
                                display: { xs: "block", md: "none" },
                              }}
                            >
                              REMOVE
                            </Button>
                          </Box>
                        </Card>
                      )}

                    {(item.productCard?.itemStatus !==
                      ProductStatusType.ACTIVE ||
                      item.productCard?.productStatus !==
                        ProductStatusType.ACTIVE) && (
                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: (theme) => theme.palette.info.main,
                              color: (theme) => theme.palette.success.main,
                              fontSize: "12px",
                              px: 1,
                              textAlign: "center",
                            },
                          },
                          arrow: {
                            sx: {
                              color: (theme) => theme.palette.info.main,
                            },
                          },
                        }}
                        title={`This item is ${ProductStatusTypeDisplay[
                          (item.productCard?.productStatus ||
                            item.productCard?.itemStatus) as ProductStatusType
                        ].toLocaleLowerCase()}. Please remove it from your cart.`}
                        arrow
                      >
                        <Card
                          key={item.id}
                          sx={{
                            mb: 2,
                            border: "1px solid #f0f0f0",
                            boxShadow: "none",
                            borderRadius: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", p: { xs: 1, md: 2 } }}>
                            <Box>
                              <Link
                                to={`/product/${item.productCard?.itemSlug}`}
                                className="router-link"
                              >
                                <Box
                                  sx={{
                                    position: "relative",
                                    width: 120,
                                    height: 120,
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={
                                      item.productCard?.itemImage ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.productCard?.itemTitle}
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: 1,
                                    }}
                                  />

                                  <Box
                                    sx={{
                                      position: "absolute",
                                      inset: 0, // shorthand for top:0; right:0; bottom:0; left:0
                                      bgcolor: "rgba(255, 255, 255, 0.7)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "text.danger",
                                        fontWeight: "bold",
                                        fontSize: { xs: "10px ", md: "14px" },
                                      }}
                                    >
                                      {
                                        ProductStatusTypeDisplay[
                                          (item.productCard?.productStatus ||
                                            item.productCard
                                              ?.itemStatus) as ProductStatusType
                                        ]
                                      }
                                    </Typography>
                                  </Box>
                                </Box>
                              </Link>
                            </Box>
                            <Box sx={{ flex: 1, ml: { xs: 1, md: 3 } }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: { xs: "1rem", md: "1.1rem" },
                                    fontWeight: 500,
                                  }}
                                >
                                  <Link
                                    to={`/product/${item.productCard?.itemSlug}`}
                                    style={{
                                      color: "inherit",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {item.productCard?.itemTitle}
                                  </Link>
                                </Typography>

                                <IconButton
                                  onClick={() => handleDeleteItem(item.id)}
                                  sx={{
                                    color: "#666",
                                    display: { xs: "none", md: "block" },
                                  }}
                                >
                                  <img
                                    src={Trash}
                                    alt="delete"
                                    style={{ width: 20 }}
                                  />
                                </IconButton>
                              </Box>
                              <Typography className="text-danger">
                                {item.productCard?.returnAllowed &&
                                  "Returnable"}
                              </Typography>

                              <Box
                                sx={{
                                  mt: 2,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {/* alskjdfahlks */}
                                <Box
                                  sx={{
                                    display: { xs: "none", md: "flex" },
                                    alignItems: "center",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 1,
                                    bgcolor: "#f8f9fa",
                                  }}
                                >
                                  {item?.qty === item?.productCard?.minQty ? (
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteItem(item.id)}
                                      sx={{ color: "#ff4444" }}
                                    >
                                      <img
                                        src={Trash}
                                        alt="delete"
                                        style={{ width: 16 }}
                                      />
                                    </IconButton>
                                  ) : (
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDecrement(item.id)}
                                    >
                                      <RemoveSharpIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                  <Typography
                                    sx={{
                                      mx: 2,
                                      minWidth: 20,
                                      textAlign: "center",
                                    }}
                                  >
                                    {item.qty}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleIncrement(item.id, item.qty)
                                    }
                                    disabled={item.qty >= 6}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>

                                <Box sx={{ ml: { sx: 0, md: 3 } }}>
                                  <Typography
                                    component="span"
                                    sx={{
                                      textDecoration: "line-through",
                                      color: "#ff4444",
                                      mr: { xs: 1, md: 1 },
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    {symbol}
                                    {"\u200A"}
                                    {item?.productCard &&
                                      item?.productCard?.itemMrp * item.qty}
                                  </Typography>
                                  <Typography
                                    component="span"
                                    sx={{
                                      fontSize: "1.1rem",
                                      fontWeight: 500,
                                      color: "#2c3e50",
                                    }}
                                  >
                                    {symbol}
                                    {"\u200A"}
                                    {item.totalPrice}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Box className="h-100 px-2 pb-2 d-flex flex-row justify-content-start align-items-center">
                            <Box
                              sx={{
                                display: { xs: "flex", md: "none" },
                                alignItems: "center",
                                border: "1px solid #e0e0e0",
                                borderRadius: 1,
                                bgcolor: "#f8f9fa",
                                width: "auto",
                                mt: 1,
                              }}
                            >
                              {item?.qty === item?.productCard?.minQty ? (
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteItem(item.id)}
                                  sx={{ color: "#ff4444" }}
                                >
                                  <img
                                    src={Trash}
                                    alt="delete"
                                    style={{ width: 16 }}
                                  />
                                </IconButton>
                              ) : (
                                <IconButton
                                  size="small"
                                  onClick={() => handleDecrement(item.id)}
                                >
                                  <RemoveSharpIcon fontSize="small" />
                                </IconButton>
                              )}
                              <Typography
                                sx={{
                                  mx: 2,
                                  minWidth: 20,
                                  textAlign: "center",
                                }}
                              >
                                {item.qty}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleIncrement(item.id, item.qty)
                                }
                                disabled={item.qty >= 6}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Button
                              onClick={() => handleDeleteItem(item.id)}
                              sx={{
                                color: (theme) => theme.palette.success.main,
                                fontSize: "0.8rem",
                                "&:hover": {
                                  color: "#ff4444",
                                },
                                mt: 1,
                                ml: 1,
                                display: { xs: "block", md: "none" },
                              }}
                            >
                              REMOVE
                            </Button>
                          </Box>
                        </Card>
                      </Tooltip>
                    )}
                  </>
                ))}
              </Paper>
              <Box
                className="w-100 mt-3 d-flex flex-row align-items-center"
                sx={{
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Button
                    variant="outlined"
                    onClick={handleClearCart}
                    sx={{
                      textTransform: "none",
                      fontSize: "16px",
                      px: 4,
                      py: 1,
                      borderColor: (theme) => theme.palette.error.main,
                      color: (theme) => theme.palette.error.main,
                      display: { xs: "none", md: "block" },
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.error.light,
                        borderColor: (theme) => theme.palette.error.dark,
                        color: "#fff",
                      },
                    }}
                  >
                    Clear Cart
                  </Button>
                </Box>

                <Box>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCheckout}
                    sx={{
                      backgroundColor: (theme) => theme.palette.success.light,
                      textTransform: "none",
                      fontSize: "16px",
                      px: 5,
                      py: 1,
                      display: { xs: "none", md: "block" },
                    }}
                  >
                    Place Order
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  position: "sticky",

                  borderRadius: 2,
                  border: "1px solid #F1EAE4",
                  top: 200,

                  backgroundColor: (theme) => theme.palette.info.main,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, color: "#1a1a1a" }}
                >
                  Price Details
                </Typography>

                <Divider sx={{ mt: 2, color: "#EED9CB" }} />

                <Box sx={{ mt: 2 }}>
                  {[
                    { label: "Total Cost", value: `${symbol}${"\u200A"}${cart.totalMrp}` },
                    { label: "Shipping Fee", value: "Free" },
                    // { label: "Delivery Charges", value: "Free" },
                    { label: "GST", value: `${symbol}${"\u200A"}0` },
                    {
                      label: "Discount",
                      value: ` ${
                        cart?.discAmount
                          ? `${symbol}${"\u200A"}${Math.round(cart?.discAmount)}`
                          : `${symbol}${"\u200A"}0`
                      }`,
                    },
                    { label: "Additional Discount", value: `${symbol}${"\u200A"}0` },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: "#5C5C5C",
                          fontSize: "15px",
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color:
                            item.label === "Discount"
                              ? (theme) => theme.palette.error.main
                              : "#1a1a1a",
                          fontSize: "15px",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ mt: 1, color: "#EED9CB" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0,
                    py: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Total Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {symbol}{"\u200A"}{cart.totalPrice}
                  </Typography>
                </Box>
                <Divider sx={{ mt: 1, mb: 2, color: "#EED9CB" }} />

                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleClearCart}
                    sx={{
                      textTransform: "none",
                      fontSize: "16px",
                      borderColor: (theme) => theme.palette.error.main,
                      color: (theme) => theme.palette.error.main,
                      "&:hover": {
                        borderColor: (theme) => theme.palette.error.dark,
                        backgroundColor: (theme) => theme.palette.error.light,
                        color: "#fff",
                      },
                    }}
                  >
                    Clear Cart
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCheckout}
                    sx={{
                      backgroundColor: (theme) => theme.palette.success.light,
                      textTransform: "none",
                      fontSize: "16px",
                      px: 5,
                      py: 1,
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    Place Order
                  </Button>
                </Box>

                {/* <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Checkbox defaultChecked size="small" />
                  <Typography variant="body2" color="text.secondary">
                    Add shipping protection (INR 0.98)
                  </Typography>
                </Box> */}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <CartIsEmptyPage />
        )}

        <Box>
          {Array.isArray(cartItemSlugs) && cartItemSlugs.length > 0 && (
            <CartRelatedProducts itemSlug={cartItemSlugs} />
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      <Modal
        open={open}
        onClose={handleCloseModel}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <>
          {!isOutOfStock && <CircularProgress />}
          {isOutOfStock && (
            <Box
              sx={{
                p: { xs: 2, lg: 5 },
                minWidth: { xs: 300, md: 500 },
                maxWidth: 500,
                bgcolor: (theme) => theme.palette.info.main,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                align="center"
                sx={{ color: (theme) => theme.palette.success.main, mb: 1 }}
              >
                Cannot Proceed to Checkout
              </Typography>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  fontSize: "1rem",
                  color: (theme) => theme.palette.success.main,
                  mb: 1,
                }}
              >
                {outOfStockItemsCount === 1 ? (
                  <div>
                    1 item in your cart is out of stock.
                    <br />
                    Please remove it before placing the order.
                  </div>
                ) : (
                  <div>
                    {outOfStockItemsCount} items in your cart are out of stock.
                    <br />
                    Please remove them before placing the order.
                  </div>
                )}
              </Typography>
              <Box className="d-flex flex-row justify-content-center align-items-center">
                <Button
                  sx={{ border: "1px solid 1E2624" }}
                  onClick={() => setOpen(false)}
                >
                  Okay
                </Button>
              </Box>
            </Box>
          )}
        </>
      </Modal>
    </div>
    // </Container>
  );
};

export default MyCart;
