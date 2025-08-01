"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Grid, Card, Typography, Button, IconButton } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import EmailIcon from "@mui/icons-material/Email";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CustomDrawer from "./wishlistDrawer";
import { useDispatch, useSelector } from "react-redux";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import type { AppDispatch, RootState } from "../../Redux/store/store";
import type { Wishlist } from "./model/wishlist";
import { DeleteWishlistItemUri } from "./profileService/profileService";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Trash from "../../assets/media/icons/trash.svg";
import { useDeleteByParams } from "../../customHooks/useDeleteByParams";
import {
  fetchWishlistItemsAsync,
  getWishlistAsync,
} from "../../Redux/slices/wishListSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import type { AddToCartRequest } from "../addToBag/model/addToCartRequest";
import { addToCartAsync } from "../../Redux/slices/addToCart";
import ManageWishlistDrawer from "./manageWishlist";
import ConfirmationDialog from "../../utils/alertModel";
import { PageState, setLocalText } from "../../web-constants/constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { LoginResponse } from "../login/model/loginResponse";
import { ProductStatusType } from "../inventoryProduct/enum/productStatusType";
import { share_product } from "../productDetailSection/service/getitemsDetails";
import { usePostByParams } from "../../customHooks/usePostByParams";
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
import { selectCurrencySymbol } from "../../Redux/slices/currencySlice";
import EmptyWishlistPage from "../../utils/notFound/emptyWishlist";

const MYWishlist: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [wishlistAllItems, setWishlistAllItems] = useState<Wishlist | any>(
    null
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWishlistId, setSelectedWishlistId] = useState<number | null>(
    null
  );
  const { username, isCustomerExist } = useSelector(
    (store: RootState) => store.jwtToken
  );
  const [sharableData, setSharableData] = useState<any>({
    description: "",
    url: "",
    title: "",
  });

  const symbol = useSelector(selectCurrencySymbol);

  // Changed: Individual share state for each item
  const [shareOpenItems, setShareOpenItems] = useState<{
    [key: string]: boolean;
  }>({});

  const wishlists = useSelector((store: RootState) => store.wishlist.wishlist);
  const wishlistItems = useSelector(
    (store: RootState) => store.wishlist.wishlistItems
  );

  const addToCartStatus = useSelector((state: RootState) => state.cart.status);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(
    null
  );
  const [isAddToCartClicked, setIsAddToCartClicked] = useState<boolean>(false);

  const cartItemsIds = useSelector(
    (state: RootState) => state.cart.cartItemsIds
  );
  const [isManageDrawerOpen, setIsManageDrawerOpen] = useState(false);

  const selectedWishlistdata = useMemo(() => {
    return wishlists.find((wl) => wl.id === selectedWishlistId) || null;
  }, [wishlists, selectedWishlistId]);

  console.log("wishlistItems  Hook=>", wishlistItems);
  console.log("wishlistAllItems setState=>", wishlistAllItems);

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { executePost } = usePostByParams();

  const shareRef = useRef<HTMLDivElement>(null);

  const { data, loading, executeDelete } = useDeleteByParams<Wishlist>();

  const [selectedItem, setSelectedItem] = useState<string>("");
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );

  useEffect(() => {
    if (wishlists && wishlists.length > 0) {
      const defaultWishlist = wishlists.find((wishlist) => wishlist.isDefault);
      if (defaultWishlist) {
        setSelectedWishlistId(defaultWishlist.id);
      } else {
        setSelectedWishlistId(wishlists[0].id);
      }
    }
  }, [wishlists]);

  const handleShare = async (itemSlug: string) => {
    const response: any = await executePost(share_product, {
      itemSlug: itemSlug,
    });

    setSharableData(response.content);
  };

  console.log("sharableData", sharableData);

  // Changed: Handle share for specific item
  const handleShareToggle = async (itemId: string, itemSlug: string) => {
    const isCurrentlyOpen = shareOpenItems[itemId];

    // Close all other share dropdowns
    setShareOpenItems({ [itemId]: !isCurrentlyOpen });

    if (!isCurrentlyOpen) {
      setSelectedItem(itemSlug);
      await handleShare(itemSlug);
    }
  };

  // Changed: Handle click outside for specific items
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as Element;
      const isShareButton = clickedElement.closest("[data-share-button]");
      const isShareDropdown = clickedElement.closest("[data-share-dropdown]");

      if (!isShareButton && !isShareDropdown) {
        setShareOpenItems({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedWishlistId !== null && wishlistItems) {
      setWishlistAllItems(wishlistItems);
    }
  }, [wishlistItems, selectedWishlistId]);

  const handleTooltipToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "share-popper" : undefined;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (username) {
      dispatch(getWishlistAsync({ username }) as any);
    }
  }, [data, username, dispatch]);

  useEffect(() => {
    if (selectedWishlistId) {
      dispatch(
        fetchWishlistItemsAsync({ wishlistId: selectedWishlistId }) as any
      );
    }
  }, [selectedWishlistId, dispatch]);

  const handleRejectDelete = () => {
    setConfirmOpen(false);
    setSelectedItemId(null);
  };

  useEffect(() => {
    if (isAddToCartClicked) {
      if (addToCartStatus === PageState.SUCCESS) {
        setSnackbar({
          open: true,
          message: "Product added to your cart",
          severity: "success",
        });
      }

      if (addToCartStatus === PageState.ERROR) {
        setSnackbar({
          open: true,
          message: "Failed to add product to cart",
          severity: "error",
        });
      }
    }
  }, [addToCartStatus]);

  const handleAcceptDelete = async (wishlistItemId: number) => {
    if (!selectedWishlistId) return;

    const selectedWishlist = wishlists.find(
      (wl) => wl.id === selectedWishlistId
    );
    const wishlistName = selectedWishlist ? selectedWishlist.name : "Wishlist";

    try {
      const response = await executeDelete(DeleteWishlistItemUri, {
        wishlistItemId,
      });
      console.log("Delete Response:", response);

      if (response !== null) {
        setSnackbar({
          open: true,
          message: `Product has been removed from ${wishlistName}!`,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: `Unable to remove product from ${wishlistName}.`,
          severity: "error",
        });
      }

      dispatch(
        fetchWishlistItemsAsync({ wishlistId: selectedWishlistId }) as any
      );
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      setSnackbar({
        open: true,
        message: `Unable to remove product from ${wishlistName}.`,
        severity: "error",
      });
    } finally {
      setConfirmOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleManageList = () => {
    const selected = wishlists.find((wl) => wl.id === selectedWishlistId);
    if (selected) {
      setSelectedWishlist(selected);
    }
    setIsManageDrawerOpen(true);
    dispatch(removeSticky());
  };

  console.log("wishlistAllItems?.wishlistItem", wishlistAllItems?.wishlistItem);

  return (
    <Box
      sx={{
        maxWidth: "1100px",
        mx: "auto",
        pb: 3,
        px: 3,
        pt: { xs: 0 },
        minHeight: "70vh",
      }}
    >
      {/* Header */}
      <Grid
        container
        justifyContent={{ xs: "center", sm: "space-between" }}
        alignItems="center"
        mb={2}
        sx={{ mt: { sm: 0, md: 1 } }}
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
      >
        <Grid
          item
          sx={{
            textAlign: "left",
            alignSelf: { xs: "flex-start", sm: "auto" },
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: "24px", sm: "30px" },
              lineHeight: "38px",
            }}
          >
            My Wishlist{" "}
            <Box
              component="span"
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "150%",
              }}
            >
              ({selectedWishlistdata?.sharable ? "Public" : "Private"})
            </Box>
          </Typography>
        </Grid>

        <Grid item>
          <Box
            sx={{
              mt: 0,
              mb: { xs: 1, md: 0 },
              display: "flex",
              flexDirection: { xs: "row", sm: "row" },
              gap: 2,
              justifyContent: {
                xs: "flex-start",
                sm: "flex-start",
                md: "flex-start",
              },
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              startIcon={
                <AddCircleOutlineOutlinedIcon
                  sx={{ fontSize: { xs: 18, md: 24 } }}
                />
              }
              onClick={() => {
                setIsDrawerOpen(true);
                dispatch(removeSticky());
              }}
              sx={{
                borderColor: "#334F3E",
                color: "#334F3E",
                textTransform: "none",
                fontSize: { xs: "12px", md: "16px" },
                borderRadius: "8px",
                padding: { xs: "4px 10px", md: "12px 20px" },
                "&:hover": { bgcolor: "#334F3E", color: "white" },
              }}
            >
              Create Wishlist
            </Button>
            <Button
              variant="outlined"
              startIcon={
                <EditOutlinedIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
              }
              onClick={handleManageList}
              sx={{
                borderColor: "#334F3E",
                color: "#334F3E",
                textTransform: "none",
                fontSize: { xs: "12px", md: "16px" },
                borderRadius: "8px",
                padding: { xs: "4px 10px", md: "12px 20px" },
                "&:hover": { bgcolor: "#334F3E", color: "white" },
              }}
            >
              Manage List
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={1} mb={2}>
        {wishlists && wishlists.length > 0 ? (
          [...wishlists]
            .sort((a, b) => (b.isDefault ? 1 : -1))
            .map((wishlist) => (
              <Button
                className="me-2"
                key={wishlist.id}
                variant="outlined"
                sx={{
                  borderRadius: 20,
                  textTransform: "none",
                  backgroundColor:
                    selectedWishlistId === wishlist.id ? "#334F3E" : "#F8FAFC",
                  color: selectedWishlistId === wishlist.id ? "white" : "black",
                  borderColor:
                    selectedWishlistId === wishlist.id ? "#334F3E" : "#B3BAC6",
                  fontSize: "14px",
                  fontWeight: "500",
                  mb: 1,
                }}
                onClick={() => setSelectedWishlistId(wishlist.id)}
              >
                {wishlist.name}
              </Button>
            ))
        ) : (
          <Typography>No wishlists found</Typography>
        )}
      </Grid>
      {wishlistAllItems?.wishlistItem?.length > 0 && (
        <Box>
          <Typography variant="h6" className="mb-2">
            You have {wishlistAllItems.wishlistItem.length} item(s) in your
            wishlist
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {
          selectedWishlistId ? (

            wishlistAllItems?.wishlistItem?.length > 0 ? (
<Grid container >
            {wishlistAllItems?.wishlistItem.map((item: any) => (
              <Grid item xs={12} sm={6} md={12} key={item.id}>
                <Card
                  variant="outlined"
                  key={item.id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { md: "center" },
                    justifyContent: "space-between",
                    p: 1.2,
                    borderRadius: "8px",
                    marginBottom: "24px",
                    borderColor: "#E3E8EF",
                  }}
                >
                  <Link
                    to={`/product/${item.productCard.itemSlug}`}
                    className="router-link"
                  >
                    {item.productCard?.itemStatus ===
                      ProductStatusType.OUT_OF_STOCK ||
                    item.productCard?.productStatus ===
                      ProductStatusType.OUT_OF_STOCK ? (
                      <Box
                        sx={{
                          position: "relative",
                          width: { xs: "100%", md: "150px" },
                          height: { xs: "200px", md: "150px" },
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            item.productCard?.itemImage || "/placeholder.svg"
                          }
                          alt={item.productCard?.itemTitle}
                          sx={{
                            width: { xs: "100%", md: "150px" },
                            height: { xs: "100%", md: "150px" },
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />

                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
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
                              fontSize: { xs: "20px", md: "12px" },
                            }}
                          >
                            Out of Stock
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: { xs: "100%", md: "150px" },
                          height: { xs: "200px", md: "150px" },
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      >
                        <Box
                          component="img"
                          src={item.productCard.itemImage}
                          alt={item.productCard.itemTitle}
                          sx={{
                            width: { xs: "100%", md: "150px" },
                            height: { xs: "100%", md: "150px" },
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    )}
                  </Link>

                  <Box
                    sx={{
                      flexGrow: 1,
                      ml: { xs: 0, md: 2 },
                      mt: { xs: 2, md: 0 },
                      width: "100%",
                    }}
                  >
                    <Link
                      to={`/product/${item.productCard.itemSlug}`}
                      className="router-link"
                    >
                      <Typography
                        style={{
                          fontWeight: "600",
                          fontSize: "20px",
                          lineHeight: "24px",
                          marginBottom: "16px",
                        }}
                      >
                        {" "}
                        {item.productCard.itemTitle}
                      </Typography>
                    </Link>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Typography
                        sx={{
                          color: "#775200",
                          fontSize: "16px",
                          fontWeight: 500,
                          lineHeight: "135%",
                        }}
                      >
                       {symbol}{"\u200A"}{item.productCard.itemPrice}
                      </Typography>
                      <Typography
                        sx={{
                          textDecoration: "line-through",
                          mx: 1,
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#77878F",
                        }}
                      >

                          {symbol}{"\u200A"}{item.productCard.itemMrp}
                      </Typography>
                      <Box
                        component="span"
                        sx={{
                          bgcolor: "#00B45F",
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 400,
                          lineHeight: "150%",
                        }}
                      >
                        {item.productCard.itemDiscount}
                        {"\u200A"}%
                      </Box>
                    </Box>
                    {item.productCard.minStockAlert && (
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
                          Hurry, Only {item.productCard.availableStock} left!
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        gap: "24px",
                        marginTop: "24px",
                      }}
                    >
                      <Button
                        variant="contained"
                        endIcon={
                          <ShoppingCartOutlinedIcon
                            sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
                          />
                        }
                        disabled={
                          cartItemsIds.includes(item.productCard.itemId) ||
                          item.productCard?.itemStatus ===
                            ProductStatusType.OUT_OF_STOCK ||
                          item.productCard?.productStatus ===
                            ProductStatusType.OUT_OF_STOCK
                        }
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.success.light,
                          textTransform: "none",
                          fontSize: { xs: "12px", sm: "13px", md: "15px" },
                          fontWeight: 500,
                          lineHeight: "24px",
                          px: { xs: 1.5, sm: 2, md: 2.5 },
                          py: { xs: 0.8, sm: 1 },
                          "&:hover": { bgcolor: "black" },
                          mr: 1,
                          "&:disabled": {
                            backgroundColor: "#cfd8dc",
                            color: "success.main",
                            cursor: "not-allowed",
                          },
                        }}
                        onClick={() => {
                          setIsAddToCartClicked(true);
                          const loginResponseData: LoginResponse = JSON.parse(
                            localStorage.getItem("loginResponse") || "{}"
                          );
                          if (
                            !loginResponseData.username ||
                            !loginResponseData.isCustomerExist
                          ) {
                            if (setLocalText) {
                              setLocalText("path", path);
                            }
                            navigate("/login");
                            return;
                          }

                          const addToCartData: AddToCartRequest = {
                            username: username,
                            productCode: item.productCard.productCode,
                            itemId: item.productCard.itemId,
                            qty: item.productCard.minQty,
                            imageUrl: item.productCard.imageUrl,
                          };

                          console.log("addToCartData", addToCartData);
                          dispatch(addToCartAsync(addToCartData));
                        }}
                      >
                        {cartItemsIds.includes(item.productCard.itemId)
                          ? "In my cart"
                          : "Add to Cart"}
                      </Button>
                      <IconButton
                        onClick={() => {
                          setSelectedItemId(item.id);
                          setConfirmOpen(true);
                        }}
                        disabled={loading}
                      >
                        <img src={Trash || "/placeholder.svg"} alt="delete" />
                      </IconButton>

                      {/* Changed: Individual share component for each item */}
                      {selectedWishlistdata?.sharable && (
                        <Box position="relative" display="inline-block" ml={1}>
                          <IconButton
                            color="primary"
                            data-share-button
                            onClick={() =>
                              handleShareToggle(
                                item.id.toString(),
                                item.productCard.itemSlug
                              )
                            }
                            sx={{ bgcolor: "#fff", zIndex: 10 }}
                          >
                            <ShareIcon />
                          </IconButton>

                          {shareOpenItems[item.id.toString()] && (
                            <Box
                              data-share-dropdown
                              sx={{
                                bgcolor: "#fff",
                                display: "flex",
                                p: 1,
                                borderRadius: 1,
                                gap: 1,
                                minWidth: "200px",
                              }}
                              position="absolute"
                              top={0}
                              left="100%"
                              ml={1}
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
                      )}
                    </Box>
                  </Box>
                </Card>
              </Grid>
                    ))}

    </Grid>
              ) : (
    <EmptyWishlistPage />
  )
) : null}
      </Grid>

      <CustomDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          dispatch(addSticky());
        }}
      />

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

      <ManageWishlistDrawer
        open={isManageDrawerOpen}
        onClose={() => {
          setIsManageDrawerOpen(false);
          setIsDrawerOpen(false);
          dispatch(addSticky());
        }}
        wishlistData={wishlistAllItems}
        wishlistlength={wishlists?.length}
      />

      <ConfirmationDialog
        open={confirmOpen}
        title="Remove Item?"
        description="Are you sure you want to remove this item?"
        onClose={handleRejectDelete}
        onAccept={() => {
          if (selectedItemId) {
            handleAcceptDelete(Number.parseInt(selectedItemId));
          }
        }}
        onReject={handleRejectDelete}
      />
    </Box>
  );
};

export default MYWishlist;
