import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Link,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrderResponse } from "../myCart/model/orderResponse";
import {
  GetOrderSummaryUri,
  OrdersByOrderNum,
  OrdersUri,
} from "./profileService/profileService";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { OrderMaster } from "../myCart/model/orderMaster";
import DcumentIcon from "../../assets/media/icons/document.svg";
import RaiseTicketForm from "./addTicketDrawer";
import { useDispatch } from "react-redux";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
// import { selectCurrencySymbol } from "../../Redux/slices/currencySlice";
import { useSelector } from "react-redux";

const OrderDetailPage = () => {
  const activitySteps = [
    { label: "Order Received", date: "March 19, 25 18:05" },
    { label: "Ready for Pickup", date: "March 20, 25 18:05" },
    { label: "Shipped", date: "March 21, 25 18:05" },
    { label: "Out For Delivery", date: "March 22, 25 18:05" },
    { label: "Order Placed", date: "March 23, 25 18:05" },
  ];
  const { orderNum } = useParams<{ orderNum: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: orders,
    isLoading,
    error,
  } = useFetchByQuery<OrderMaster>(OrdersByOrderNum, { orderNum });

  const { data: fetchedOrderSummary, fetchData } =
    useFetchByQuery<OrderResponse>(GetOrderSummaryUri, { orderNum });

  const [isRaiseTicketeDrawerOpen, setIsRaiseTicketeDrawerOpen] =
    useState(false);

  const dispatch = useDispatch();
  // const symbol = useSelector(selectCurrencySymbol);

  const handleClick = () => {
    navigate("/overview/orders");
  };

  const handleTicketRaise = () => {
    setIsRaiseTicketeDrawerOpen(true);
    dispatch(removeSticky());
  };

  return (
    <>
      {!isMobile && (
        <Box
          sx={{
            padding: 1,
            backgroundColor: (theme) => theme.palette.info.main,
          }}
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
                onClick={() => navigate("/overview/orders")}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },

                  fontWeight: 500,
                }}
              >
                Orders
              </Link>
              <Link
                underline="hover"
                color="inherit"
                sx={{
                  cursor: "default",
                  "&:hover": {
                    textDecoration: "none",
                  },

                  color: (theme) => theme.palette.success.light,
                  fontWeight: 500,
                }}
              >
                Order Details
              </Link>
            </Breadcrumbs>
          </div>
        </Box>
      )}

      <Box
        p={2}
        className="hide-scrollbars"
        maxWidth="1300px"
        mx="auto"
        minHeight={"100vh"}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <IconButton onClick={handleClick} sx={{ p: 0.5, mr: 1 }} size="small">
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "1.1rem", // mobile
                sm: "1.25rem", // small tablets
                md: "1.5rem", // desktop
              },
            }}
          >
            Orders Detail Page
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Side: Summary */}
          <Grid item className="order-2 order-md-1" xs={12} md={8}>
            <Box
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid info.main",
                backgroundColor: (theme) => theme.palette.info.main,
                borderRadius: 1,
              }}
            >
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="subtitle2">
                    Order No: <strong>{fetchedOrderSummary?.orderNum}</strong>
                  </Typography>
                  {fetchedOrderSummary?.placedOn && (
                    <Typography variant="body2" color="text.secondary">
                      Order Placed:{" "}
                      {new Intl.DateTimeFormat("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                      }).format(new Date(fetchedOrderSummary.placedOn + "Z"))}
                    </Typography>
                  )}
                </Grid>
                <Grid item>
                  <Button
                    startIcon={
                      <Box
                        component="img"
                        src={DcumentIcon}
                        alt="Document"
                        sx={{ width: 18, height: 18 }}
                      />
                    }
                    sx={{
                      backgroundColor: "#334F3E",
                      color: "#fff",
                      textTransform: "none",
                    }}
                    onClick={handleTicketRaise}
                  >
                    Raise Ticket
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              {orders?.orderItems?.map((item, i) => (
                <Box key={item.id} mb={2}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box
                        component="img"
                        src={
                          item.productCard?.itemImage ||
                          "https://via.placeholder.com/60"
                        }
                        alt={item.productCard?.itemTitle || "Product Image"}
                        sx={{
                          width: { xs: 80, sm: 60 },
                          height: { xs: 80, sm: 60 },
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.productCard?.itemTitle}
                      </Typography>
                      <Typography variant="body2">Qty: {item.qty}</Typography>
                      <Typography variant="body2">
                        {/* Unit Price: {symbol} */}
                        {"\u200A"}
                        {item.unitPrice} | Discount: -{"\u200A"}
                        {/* {symbol} */}
                        {"\u200A"}
                        {/* {item.discAmount} | Total Amount: {symbol} */}
                        {"\u200A"}
                        {item.totalPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                  {i < orders.orderItems.length - 1 && (
                    <Divider sx={{ mt: 2, mb: 2 }} />
                  )}
                </Box>
              ))}
            </Paper>

            {/* Price Details */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Price Details
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography>Total Cost</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>
                    {/* {symbol} */}
                    {"\u200A"}
                    {fetchedOrderSummary?.totalMrp}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography>Shipping Fee</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>
                    {fetchedOrderSummary?.shippingCharge === 0
                      ? "Free"
                      : `₹${fetchedOrderSummary?.shippingCharge}`}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography>Delivery Charges</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>Free</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography>Discount Amount</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>
                    {/* -{symbol} */}
                    {"\u200A"}
                    {fetchedOrderSummary?.discAmount}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography>Additional Discount</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>
                    {/* -{symbol} */}
                    {"\u200A"}
                    {fetchedOrderSummary?.couponDiscAmount}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography fontWeight="bold">Total</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography fontWeight="bold">
                    {/* {symbol} */}
                    {"\u200A"}
                    {fetchedOrderSummary?.finalPrice}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Address */}
            <Grid container spacing={2}>
              {[
                {
                  label: "Shipping Address",
                  address: fetchedOrderSummary?.shippingAddress,
                },
                {
                  label: "Billing Address",
                  address: fetchedOrderSummary?.billingAddress,
                },
              ].map(({ label, address }) => (
                <Grid item xs={12} md={6} key={label} sx={{ display: "flex" }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, width: "100%", height: "100%" }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {label}
                    </Typography>
                    <Typography>{address?.fullName}</Typography>
                    <Typography>
                      {address?.addressLine1}, {address?.addressLine2}
                    </Typography>
                    <Typography>
                      {address?.city}, {address?.state}, {address?.country} -{" "}
                      {address?.postalCode}
                    </Typography>
                    <Typography>
                      Phone Number: {address?.phoneNumber}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Side: Activity Timeline */}
          <Grid item className="order-1 order-md-2" xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: (theme) => theme.palette.info.main,
                minHeight: "100%",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Activity
              </Typography>
              <List>
                {activitySteps.map((step, i) => (
                  <ListItem key={i} alignItems="flex-start">
                    <ListItemIcon>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={step.label}
                      secondary={
                        <Typography variant="caption">{step.date}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {orders && orders.orderNum && (
          <RaiseTicketForm
            open={isRaiseTicketeDrawerOpen}
            orderNum={fetchedOrderSummary?.orderNum}
            onClose={() => {
              setIsRaiseTicketeDrawerOpen(false);
              dispatch(addSticky());
            }}
          />
        )}
      </Box>
    </>
  );
};

export default OrderDetailPage;
