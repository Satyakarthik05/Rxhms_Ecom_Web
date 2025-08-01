import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  CardActionArea,
  Snackbar,
  CircularProgress,
  Chip,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
// import SearchIcon from "@mui/icons-material/Search";
import "../sections/bestSeller/bestSeller.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductCard } from "../sections/inventoryProduct/model/productCard";
import { AppDispatch, RootState } from "../Redux/store/store";
import { useSelector } from "react-redux";
import { PageState, setLocalText } from "../web-constants/constants";
import { AddToCartRequest } from "../sections/addToBag/model/addToCartRequest";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../Redux/slices/addToCart";
import MuiAlert from "@mui/material/Alert";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Favorite } from "@mui/icons-material";
import {
  createWishlistItemAsync,
  deleteDefaultWishItemAsync,
  getDefaultWishlistAsync,
} from "../Redux/slices/wishListSlice";
import { LoginResponse } from "../sections/login/model/loginResponse";
import { selectCurrencySymbol } from "../Redux/slices/currencySlice";

interface CustomCartProps {
  product?: ProductCard | any;
}

export const CustomCard: React.FC<CustomCartProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState<number | null>(null);

  const username = useSelector((state: RootState) => state.jwtToken.username);
  const isCustomerExist = useSelector(
    (state: RootState) => state.jwtToken.isCustomerExist
  );

  const { flagDetails, flagItemsIds } = useSelector(
    (state: RootState) => state.flag
  );
  const { status: wishlistStatus, defaultWishListItemsIds } = useSelector(
    (store: RootState) => store.wishlist
  );

  const symbol = useSelector(selectCurrencySymbol);

  console.log("@@@defaultWishListItemsIds", defaultWishListItemsIds);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });

  const location = useLocation();
  const path = location.pathname;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const cartItemsIds = useSelector(
    (state: RootState) => state.cart.cartItemsIds
  );

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // const handleAddToBag = async (product: ProductCard) => {
  //   const loginResponseData: LoginResponse = JSON.parse(
  //     localStorage.getItem("loginResponse") || "{}"
  //   );

  //   if (!loginResponseData.username || !loginResponseData.isCustomerExist) {
  //     if (setLocalText) {
  //       setLocalText("path", path);
  //     }
  //     navigate("/login");
  //     return;
  //   }

  //   console.log("product", product);

  //   const addToCartData: AddToCartRequest = {
  //     username: username,
  //     productCode: product.productCode,
  //     itemId: product.itemId,
  //     qty: product.minQty || 1,
  //     imageUrl: product.itemImage,
  //   };

  //   console.log("addToCartData", addToCartData);

  //   try {
  //     await dispatch(addToCartAsync(addToCartData)).unwrap();
  //     setSnackbar({
  //       open: true,
  //       message: "Product has been added to cart",
  //       severity: "success",
  //     });
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: "Failed to add the product to the cart. Please try again!",
  //       severity: "error",
  //     });
  //   }
  // };

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

    // if (setActiveId) {
    //   setActiveId(product.itemId);
    // }

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
        // setIsWishlisted(true);
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

  const isHasflag = flagItemsIds.includes(product.itemId);
  let thisflagDetails;
  if (isHasflag) {
    thisflagDetails = flagDetails[product.itemId];
  }

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

  const getFlagBackgroundColor = (color: string | null | undefined): string => {
    if (!color || color.trim() === "") {
      return "#00000cc";
    }
    return color;
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Card
        className="seller-card-details"
        sx={{
          boxShadow: "none",
          position: "relative",
          borderRadius: "10px",
          width: "100%",
          overflow: "hidden",
          "& .hoverIcons": {
            opacity: { xs: 0.8, md: 0 },
            transition: "opacity 0.3s ease-in",
          },
          "&:hover .hoverIcons": {
            opacity: { xs: 0.8, md: 0.8 },
          },
        }}

        // sx={{
        //   boxShadow: "none",
        //   position: "relative",
        //   borderRadius: "10px",
        //   width: "100%",
        //   overflow: "hidden",
        //   opacity: { xs: 1, md: "none" },
        //   "&:hover .hoverIcons": {
        //     opacity: { xs: 1, md: 1 },
        //   },
        // }}
      >
        {isHasflag && thisflagDetails !== undefined && (
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
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: `${
                  thisflagDetails?.backgroundColor || "#00000cc"
                }`,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "14px" },
                color: `${thisflagDetails?.textColour}`,
              }}
            >
              {thisflagDetails?.flag}
            </Typography>
          </Box>
        )}

        <CardActionArea>
          {isHasflag && (
            <Box
              sx={{
                position: "absolute",
                p: 0.8,
                py: 0.5,
                pl: 1,
                left: 0,
                top: 10,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                backgroundColor: getFlagBackgroundColor(
                  thisflagDetails?.flagColour
                ),
                "&:hover": {
                  backgroundColor: ``,
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
          <Link to={`/product/${product.itemSlug}`}>
            <CardMedia
              component="img"
              image={product.itemImage}
              alt={product.itemSlug}
              sx={{
                objectFit: "cover",
                borderRadius: "8px",
                height: { xs: 200, sm: 250, md: 310 },
              }}
            />
          </Link>

          <Box
            className="hoverIcons"
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "black",
              px: "4px",
              opacity: 0,
              transition: "opacity 0.3s",
              borderRadius: "0 0 8px 8px",
            }}
          >
            {/* Left side icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => {
                  if (defaultWishListItemsIds.includes(product.itemId)) {
                    // removeItem in the defalut wishlist
                    setIsWishlisted(product.itemId);
                    deleteWishlistItemFromDefault(product.itemId);
                  } else {
                    handleAddToWishlist();
                    setIsWishlisted(product.itemId);
                  }
                }}
                sx={{ color: "white" }}
              >
                {wishlistStatus === PageState.LOADING &&
                isWishlisted === product.itemId ? (
                  <CircularProgress size={20} color="inherit" />
                ) : defaultWishListItemsIds.includes(product.itemId) ? (
                  <Favorite
                    color="error"
                    sx={{ fontSize: { xs: 20, md: 25 }, p: { xs: 0, md: 0.1 } }}
                  />
                ) : (
                  <FavoriteBorderOutlinedIcon
                    sx={{ fontSize: { xs: 20, md: 25 }, p: { xs: 0, md: 0.1 } }}
                  />
                )}
              </IconButton>
            </Box>

            <IconButton
              onClick={() => handleAddToBag(product)}
              disabled={cartItemsIds.includes(product.itemId)}
              sx={{
                color: "white",
              }}
            >
              {/* <ShoppingBagIcon /> */}
              <ShoppingCartRoundedIcon sx={{ fontSize: { xs: 20, md: 25 } }} />
              <Typography
                sx={{
                  color: "white",
                  fontSize: { xs: 12, md: 13 },
                  ml: 0.2,
                  mr: { xs: 0.5, md: 0 },
                  marginTop: "5px",
                  textTransform: "capitalize",
                }}
              >
                {cartItemsIds.includes(product.itemId) ? "IN CART" : "ADD"}
              </Typography>
            </IconButton>
          </Box>
        </CardActionArea>
        <CardContent
          sx={{
            padding: { xs: "5px", md: "10px 0px 0px 0px" },
            paddingBottom: "0px !important",
            textAlign: "left",
          }}
        >
          <Typography
            sx={{ fontSize: { xs: "0.9rem", md: "1.05rem" } }}
            variant="body1"
          >
            {product.itemTitle}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {symbol}
            {"\u200A"}
            {product?.itemPrice}
          </Typography>

          {/* {product.minStockAlert && (
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
                Hurry, Only {product.availableStock} left!
              </Typography>
            </Box>
          )} */}
        </CardContent>
      </Card>
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
    </Box>
  );
};
