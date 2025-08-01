import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store/store";
import { AddToCartRequest } from "../addToBag/model/addToCartRequest";
import { useDispatch } from "react-redux";
import {
  // addDataToCart,
  addToCartAsync,
  clearCart,
  // getCartAsync,
} from "../../Redux/slices/addToCart";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  createWishlistItemAsync,
  deleteDefaultWishItemAsync,
  getDefaultWishlistAsync,
} from "../../Redux/slices/wishListSlice";
import { PageState, setLocalText } from "../../web-constants/constants";
import { ProductCard } from "./model/productCard";
import { LoginResponse } from "../login/model/loginResponse";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { usePatchByParams } from "../../customHooks/usePatchByParams";
import { useDeleteByParams } from "../../customHooks/useDeleteByParams";
import { Cart } from "../addToBag/model/cart";
import Trash from "../../assets/media/icons/trash.svg";

import {
  decreaseCartItem,
  increaseCartItem,
} from "../myCart/service/myCartService";
import { selectCurrencySymbol } from "../../Redux/slices/currencySlice";

interface ProductCardProps {
  product: ProductCard;
  setAddItemId: (id: number[]) => void;
  addItemId: number[];
  activeId?: number | null;
  setActiveId?: (id: number | null) => void;
}

export const ProductCards: React.FC<ProductCardProps> = ({
  product,
  setAddItemId,
  addItemId,
  setActiveId,
  activeId,
}) => {
  const username = useSelector((state: RootState) => state.jwtToken.username);
  const [count, setCount] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch<AppDispatch>();

  const { flagDetails, flagItemsIds } = useSelector(
    (state: RootState) => state.flag
  );

  const { status: wishlistStatus, defaultWishListItemsIds } = useSelector(
    (store: RootState) => store.wishlist
  );
  const symbol = useSelector(selectCurrencySymbol);

  // const cartItemsIds = useSelector(
  //   (state: RootState) => state.cart.cartItemsIds
  // );

  // console.log("@@@cartItemsIds", cartItemsIds);
  console.log("@@@defaultWishListItemsIds", defaultWishListItemsIds);

  // const addToCartStatus = useSelector((store: RootState) => store.cart.status);
  // const { data, loading, executeDelete } = useDeleteByParams<Wishlist>();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });

  const [isWishlisted, setIsWishlisted] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const cartData = useSelector((store: RootState) => store.cart.cart.cartItems);
  const {
    data: incDecData,
    executePatch,
  } = usePatchByParams();

  const {
    // data: deleteItemFromCart,
    
    error: DeleteItemError,
    
  } = useDeleteByParams<Cart>();

  const isCartItem = useMemo(() => {
    if (Array.isArray(cartData)) {
      const initialCartData: any = cartData.filter(
        (each) => each.productCard?.itemId === product.itemId
      );
      return initialCartData[0];
    } else {
      return {};
    }
  }, [cartData, product.itemId]);

  useEffect(() => {
    if (isCartItem && Object.keys(isCartItem).length > 0 && isCartItem?.qty) {
      setCount(isCartItem?.qty);
    }
  }, [isCartItem]);

  // isCartItem

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
          productCode: product.productCode,
          itemId: product.itemId,
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

  const handleAddToBag = async (product: ProductCard) => {
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

    if (setActiveId) {
      setActiveId(product.itemId);
    }

    const addToCartData: AddToCartRequest = {
      username: username,
      productCode: product.productCode,
      itemId: product.itemId,
      qty: product.minQty || 1,
      imageUrl: product.itemImage,
    };

    try {
      await dispatch(addToCartAsync(addToCartData)).unwrap();

      const { qty } = addToCartData;
      const message =
        qty > 1
          ? `Minimum quantity is ${qty}. We've added ${qty} item${
              qty > 1 ? "s" : ""
            } to your cart.`
          : `Product has been added to your cart.`;

      setSnackbar({
        open: true,
        message,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add the product to the cart. Please try again!",
        severity: "error",
      });
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

  // useEffect(() => {
  //   if (addToCartStatus === PageState.SUCCESS && product.itemId === activeId) {
  //     setAddItemId([...addItemId, product.itemId]);
  //   }
  // }, [addToCartStatus, product.itemId, activeId]);

  // const isCartItem = cartItemsIds.includes(product.itemId);
  const isHasflag = flagItemsIds.includes(product.itemId);
  let thisflagDetails;
  if (isHasflag) {
    thisflagDetails = flagDetails[product.itemId];
  }

  const getFlagBackgroundColor = (color: string | null | undefined): string => {
    if (!color || color.trim() === "") {
      return "#000000cc";
    }
    return color;
  };
  // const isLoading =
  //   addToCartStatus === PageState.LOADING && product.itemId === activeId;

  console.log("thisflagDetails", thisflagDetails);
  console.log("&^&^&^__cartData", cartData);

  const handleIncrement = async (
    cartItemId: number,
    qty: number
  ): Promise<void> => {
    try {
      if (product && product.maxQty && qty >= product.maxQty) {
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
      // const response: any = await executeDelete(deleteCartItem, {
      //   cartItemId: itemId,
      // });

      if (cartData?.length === 1) {
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
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to remove product from cart. Please try again!",
        severity: "error",
      });
    }
  };

  // useEffect(() => {
  //   console.log("cart INc_Dec", incDecData);
  //   if (incDecData && Object.keys(incDecData).length > 0) {
  //     dispatch(addDataToCart(incDecData));
  //   }
  // }, [incDecData]);

  // useEffect(() => {
  //   console.log("cart del", incDecData);
  //   if (deleteItemFromCart) {
  //     dispatch(getCartAsync({ username: username }));
  //   }
  // }, [deleteItemFromCart]);

  const hasCartItem = Boolean(isCartItem && Object.keys(isCartItem).length > 0);

  return (
    <Card
      variant="outlined"
      sx={{
        p: { xs: 0.5, md: 1.5 },
        borderRadius: 2,
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderColor: "info.main",
        pb: 5,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Link to={`/product/${product.itemSlug}`}>
          <CardMedia
            component="img"
            image={product.itemImage}
            alt={product.itemTitle}
            sx={{
              height: { xs: 170, md: 260 },
              borderRadius: 2,
              objectFit: "cover",
            }}
          />
        </Link>
        <IconButton
          sx={{
            position: "absolute",
            p: 0.6,
            right: 8,
            top: 8,
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
          aria-label="add to favorites"
          onClick={() => {
            if (defaultWishListItemsIds.includes(product.itemId)) {
              // removeItem in the defalut wishlist
              setIsWishlisted(product.itemId);
              deleteWishlistItemFromDefault(product.itemId);
            } else {
              setIsWishlisted(product.itemId);
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
          isWishlisted === product.itemId ? (
            <CircularProgress size={20} color="inherit" />
          ) : defaultWishListItemsIds.includes(product.itemId) ? (
            <Favorite color="error" fontSize="medium" />
          ) : (
            <FavoriteBorder fontSize="medium" />
          )}
        </IconButton>
        {isHasflag && (
          <Box
            sx={{
              position: "absolute",
              p: 0.8,
              py: 0.2,
              pl: 1,
              left: 0,
              top: 8,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
              backgroundColor: getFlagBackgroundColor(
                thisflagDetails?.flagColour
              ),
              "&:hover": {
                backgroundColor: " ",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "14px" },
                color: `${thisflagDetails?.textColour}`,
              }}
            >
              {thisflagDetails.flag}
            </Typography>
          </Box>
        )}
      </Box>
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          pl: 0.5,
          pr: 0,
        }}
      >
        <Link to={`/product/${product.itemSlug}`} className="router-link">
          <Typography
            variant="h6"
            component="div"
            className="text-start"
            sx={{
              fontSize: { xs: "0.9rem", md: "1.05rem" },
              fontWeight: 400,
              lineHeight: 1.2,
              mb: 1,
              color: (theme) => theme.palette.success.main,
              // height: "2.4em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.productTitle}
          </Typography>
        </Link>
        <Box
          // sx={{ mb: { xs: 2.5, md: 3.5 } }}
          display="flex"
          justifyContent="start"
          alignItems="center"
          gap={1}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: "500",
              fontSize: { xs: "1rem", md: "1.3rem" },
              color: (theme) => theme.palette.success.main,
              p: 0,
            }}
          >
            {symbol}
            {"\u200A"}
            {product.itemPrice}
          </Typography>
          <Typography
            sx={{
              textDecoration: "line-through",
              fontSize: { xs: "0.8rem", md: "1rem" },
            }}
            className="text-center "
            variant="body2"
            color="error.main"
          >
            {!isMobile && product.currency} {product.itemMrp}
          </Typography>
          <Typography
            variant="body2"
            color="text.success"
            sx={{ fontWeight: 500, fontSize: { xs: "0.8rem", md: "1rem" } }}
          >
            {isMobile && <> {parseInt(String(product.itemDiscount))}% </>}
            {!isMobile && <>({product.itemDiscount}%)</>}
          </Typography>
        </Box>
        <Box className="text-start" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
          {product.minStockAlert && (
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
                Hurry, Only {product?.availableStock} left!
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 8, md: 16 },
            left: { xs: 8, md: 16 },
          }}
          className="d-flex flex-row justify-content-start align-items-center"
        >
          {!hasCartItem && (
            <Button
              variant="contained"
              sx={{
                mt: { xs: 4, md: 2 },
                fontSize: { xs: "0.7rem", md: "0.9rem" },
                backgroundColor: "success.light",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "success.main",
                  color: "#fff",
                },
                "&:disabled": {
                  backgroundColor: "#cfd8dc",
                  color: "success.main",
                  cursor: "not-allowed",
                },
                // width: "100%",
              }}
              onClick={() => handleAddToBag(product)}
            >
              Add to Cart
              <ShoppingCartOutlinedIcon
                sx={{ ml: 0.9, fontWeight: 400, fontSize: "medium" }}
              />
            </Button>
          )}
          {hasCartItem && (
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
                  if (count !== product.minQty) {
                    handleDecrement(isCartItem.id);
                  } else {
                    handleDeleteItem(isCartItem.id);
                  }
                }}
                sx={{
                  color: "#334f3e",
                  minWidth: { xs: 28, sm: 32, md: 36 },
                  // p: 0,
                }}
              >
                {count === product.minQty ? (
                  <img
                    src={Trash || "/placeholder.svg"}
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
                px={{ xs: 1, sm: 1, md: 2 }}
                fontSize={{
                  xs: "13px",
                  sm: "14px",
                  md: "14px",
                }}
              >
                {count}
              </Typography>

              <Button
                disabled={count === product.maxQty}
                onClick={() => handleIncrement(isCartItem.id, count)}
                sx={{
                  color: "#334f3e",
                  minWidth: { xs: 28, sm: 32, md: 36 },
                  // p: 0,
                }}
              >
                <AddIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>

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
    </Card>
  );
};
