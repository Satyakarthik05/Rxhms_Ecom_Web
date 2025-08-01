import React from "react";
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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DocumentIcon from "../../assets/media/icons/document.svg";
import { useNavigate, useParams } from "react-router-dom";
import { OrderReturnRequest } from "./orderReturn/model/orderReturnRequest";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { getOrderReturnRequestUri } from "./profileService/profileService";
import {
  ReturnStatusType,
  ReturnStatusTypeDisplay,
} from "./orderReturn/enum/returnStatusType";
import { Chip } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrencySymbol } from "../../Redux/slices/currencySlice";

const activitySteps = [
  { label: "Order Received", date: "June 10, 2025 10:00 AM" },
  { label: "Ready for Pickup", date: "June 11, 2025 2:00 PM" },
  { label: "Shipped", date: "June 12, 2025 5:00 PM" },
  { label: "Out For Delivery", date: "June 13, 2025 8:00 AM" },
  { label: "Order Placed", date: "June 14, 2025 9:30 AM" },
];

const OrderReturnItems = () => {
  

  const { orderNum } = useParams<{ orderNum: string }>();

  const { data: ordersReturnItems } = useFetchByQuery<OrderReturnRequest>(
    getOrderReturnRequestUri,
    { orderNum }
  );

  const navigate = useNavigate();
    const symbol = useSelector(selectCurrencySymbol);
  

  const handleClick = () => {
    navigate("/overview/orders");
  };

  return (
    <Box p={2} maxWidth="1300px" mx="auto">
      <Typography variant="h5" fontWeight="bold" mb={2}>
        <IconButton onClick={handleClick}>
          <ArrowBackIcon />
        </IconButton>
        Order Returns Page
      </Typography>
      <Grid container spacing={3}>
        {/* Left Side */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              p: 2,
              mb: 3,
              border: "1px solid info.main",
              backgroundColor: (theme) => theme.palette.info.main,
              borderRadius: 1,
            }}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="subtitle2">
                  Order #: <strong>{orderNum}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Requested On:{" "}
                  {ordersReturnItems?.requestedOn &&
                    new Intl.DateTimeFormat("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    }).format(new Date(ordersReturnItems.requestedOn))}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  startIcon={
                    <Box
                      component="img"
                      src={DocumentIcon}
                      alt="Document"
                      sx={{ width: 18, height: 18 }}
                    />
                  }
                  sx={{
                    backgroundColor: "#334F3E",
                    color: "#fff",
                    textTransform: "none",
                  }}
                >
                  Raise Ticket
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            {ordersReturnItems?.returnItems.map((item, i) => (
              <Box key={item.id} mb={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <img
                      src={item.productCard.itemImage}
                      alt={item.productCard.itemTitle}
                      width={60}
                      height={60}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.productCard.itemTitle}
                    </Typography>
                    <Typography variant="body2">Qty: {item.qty}</Typography>
                    <Typography variant="body2">
                      Unit Price: {symbol}
                      {"\u200A"}
                      {item.unitPrice} | Total: {symbol}
                      {"\u200A"}
                      {item.totalPrice}
                    </Typography>
                  </Grid>
                </Grid>
                {i < ordersReturnItems.returnItems.length - 1 && (
                  <Divider sx={{ mt: 2, mb: 2 }} />
                )}
              </Box>
            ))}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Price Details
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography>Total Return Value</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography>{symbol}{"\u200A"}{ordersReturnItems?.finalPrice}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Return Status</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                {ordersReturnItems?.status && (
                  <Chip
                    label={ReturnStatusTypeDisplay[ordersReturnItems.status]}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      color:
                        ordersReturnItems.status === ReturnStatusType.RETURNED
                          ? "#4CAF50"
                          : ordersReturnItems.status ===
                            ReturnStatusType.CANCELLED
                          ? "#F44336"
                          : "#FFA500",
                      backgroundColor:
                        ordersReturnItems.status === ReturnStatusType.RETURNED
                          ? "rgba(76, 175, 80, 0.1)"
                          : ordersReturnItems.status ===
                            ReturnStatusType.CANCELLED
                          ? "rgba(244, 67, 54, 0.1)"
                          : "rgba(255, 165, 0, 0.1)",
                      "& .MuiChip-label": {
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      },
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Address Details */}
          {/* <Grid container spacing={2}>
                      ordersReturnItems?.status ?? ReturnStatusType.REQUESTED
                    ]
                  }
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Address Details */}
          {/* <Grid container spacing={2}>
            {[
              mockOrderSummary.shippingAddress,
              mockOrderSummary.billingAddress,
            ].map((addr, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {index === 0 ? "Shipping Address" : "Billing Address"}
                  </Typography>
                  <Typography>{addr.fullName}</Typography>
                  <Typography>
                    {addr.addressLine1}, {addr.addressLine2}
                  </Typography>
                  <Typography>
                    {addr.city}, {addr.state}, {addr.country} -{" "}
                    {addr.postalCode}
                  </Typography>
                  <Typography>Phone: {addr.phoneNumber}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid> */}
        </Grid>

        {/* Right Side: Activity */}
        <Grid item xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: (theme) => theme.palette.info.main,
              minHeight: "90%",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Activity
            </Typography>
            <List>
              {activitySteps.map((step, i) => (
                <ListItem key={i}>
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
    </Box>
  );
};

export default OrderReturnItems;
