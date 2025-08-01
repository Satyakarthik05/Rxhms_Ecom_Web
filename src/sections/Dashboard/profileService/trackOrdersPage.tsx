import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton,
  Card,
  Snackbar,
  Alert,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { useFetchByQuery } from "../../../customHooks/useFetchByQuery";
import { OrderResponse } from "../../myCart/model/orderResponse";
import { CancelOrderUri, GetOrderSummaryUri } from "./profileService";
import {
  OrderStatus,
  OrderStatusDisplay,
} from "../../myCart/model/orderStatus";
import OrderReviewDrawer from "../orderReviewDrawer";
import { useDispatch } from "react-redux";
import {
  addSticky,
  removeSticky,
} from "../../../Redux/slices/headerStickyToggle";
import CancelOrderDialog from "../cancelOrderDialog";
import { OrderCancellation } from "../../myCart/model/orderCancellation";
import { usePostByBody } from "../../../customHooks/usePostByBody";
import { CancelledByType } from "../../myCart/model/cancelledByType";
import ReturnIcon from "../../../assets/media/icons/Return.svg";
import DcumentIcon from "../../../assets/media/icons/document.svg";
import RaiseTicketForm from "../addTicketDrawer";

const steps = [
  "Order Received",
  "Ready for Pickup",
  "Shipped",
  "Out for Delivery",
  "Delivery",
];

const TrackOrdersPage: React.FC = () => {
  const activeStep = 5;
  const navigate = useNavigate();
  const { orderNum } = useParams<{ orderNum: string }>();

  const { data: fetchedOrderSummary, fetchData } =
    useFetchByQuery<OrderResponse>(GetOrderSummaryUri, { orderNum });

  const [reviewDrawer, setReviewDrawer] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [orderSummary, setOrderSummary] = useState<OrderResponse | null>(null);
  const [cOpen, setCOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { executePost } = usePostByBody<any>();
  const [isRaiseTicketeDrawerOpen, setIsRaiseTicketeDrawerOpen] =
    useState(false);
// const [sele]

  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchedOrderSummary) {
      setOrderSummary(fetchedOrderSummary);
    }
  }, [fetchedOrderSummary]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenCancelDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCOpen(true);
  };

  const handleCancel = async (reason: string) => {
    if (!selectedOrderId) return;

    const cancelPayload: OrderCancellation = {
      id: null,
      orderId: selectedOrderId,
      cancelledOn: null,
      cancelledBy: CancelledByType.CUSTOMER,
      reason: reason,
      cancelledCharges: null,
      cancelledAmount: null,
    };

    const responce: any = await executePost(CancelOrderUri, cancelPayload);
    if (responce && fetchData) {
      fetchData(true, GetOrderSummaryUri, { orderNum });
      setSnackbarMessage("Order cancelled successfully.");
      setSnackbarSeverity("success");
      console.log("Cancelled successfully");
    } else {
      setSnackbarMessage("Failed to cancel order. Please try again.");
      setSnackbarSeverity("error");
      console.log("Failed to cancel");
    }

    setSnackbarOpen(true);
    setCOpen(false);
    setSelectedOrderId(null);
  };

  const handleClick = () => {
    navigate("/overview/orders");
  };

  const handleReturnClick = (orderNum: number) => {
    navigate(`/return-order/${orderNum}`);
  };

  const handleTicketRaise = () => {
    setIsRaiseTicketeDrawerOpen(true);
    dispatch(removeSticky());
  };

  console.log( "orderSummary.orderNum" , orderSummary &&  orderSummary?.orderNum)

  return (
    <Box p={3} sx={{ maxWidth: "1100px", mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        <IconButton onClick={handleClick}>
          <ArrowBackIcon />
        </IconButton>
        Track Orders
      </Typography>
      <Box className="d-flex flex-row justify-content-between">
        <Typography mb={3}>Delivery address</Typography>
        {orderSummary !== null &&
          orderSummary.orderStatus === OrderStatus.DELIVERED && (
            <>
              <Button
                onClick={() => {
                  setReviewDrawer(true);
                  dispatch(removeSticky());
                }}
              >
                Give Rating
              </Button>
            </>
          )}
      </Box>

      {/* {orderSummary && typeof orderSummary.id === "number" && (
        <OrderReviewDrawer
          open={reviewDrawer}
          orderId={orderSummary.id}
          onClose={() => {
            setReviewDrawer(false);
            dispatch(addSticky());
          }}
          productId={243}
          onReviewSubmitted={() => "onReviewSubmitted"}
        />
      )} */}

      <Grid container spacing={2} mb={3}>
        {[orderSummary?.shippingAddress, orderSummary?.billingAddress].map(
          (addr, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={0}
                sx={{ p: 2, height: "100%", border: "2px solid #F1EAE4" }}
              >
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  {index === 0 ? "Shipping Address" : "Billing Address"}
                </Typography>
                <Divider sx={{ border: "2px solid #F1EAE4", mb: 2 }} />
                <Grid container spacing={1}>
                  <Grid item xs={12} display="flex" alignItems="center">
                    <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />
                    <Typography fontWeight="bold">{addr?.fullName}</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="d-flex flex-row justify-content-start align-items-start"
                  >
                    <FmdGoodOutlinedIcon sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" className="fw-5 mb-3">
                        Address
                      </Typography>
                      <Typography variant="body2">
                        {addr?.addressLine1}, {addr?.addressLine2}, {addr?.city}
                        , {addr?.state}, {addr?.country} - {addr?.postalCode},{" "}
                        {addr?.phoneNumber}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )
        )}
      </Grid>

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        flexWrap="wrap"
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={2}
        py={5}
        sx={{ backgroundColor: "#F8FAFC" }}
      >
        {steps.map((label, index) => (
          <Box
            key={label}
            display="flex"
            flexDirection={{ xs: "row", sm: "column", md: "row" }}
            alignItems="center"
            flex={1}
            minWidth="180px"
            gap={1}
          >
            {/* Step icon */}
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor:
                  index <= activeStep - 1 ? "#0AA44F" : "#cfd8dc",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              {index + 1}
            </Box>

            {/* Label and date */}
            <Box ml={1}>
              <Typography variant="body2" fontWeight="bold">
                {label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                March {19 + index}, 25 18:05
              </Typography>
            </Box>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <Box
                sx={{
                  flexGrow: 1,
                  height: 2,
                  bgcolor: index < activeStep - 1 ? "#0AA44F" : "#e0e0e0",
                  mx: 2,
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Order Details */}
      {orderSummary && (
        <Card variant="outlined" sx={{ border: "2px solid #F1EAE4" }}>
          {/* Header - Order Info */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{
              backgroundColor: (theme) => theme.palette.info.main,
              p: 2,
              borderRadius: 1,
              mb: 2,
            }}
          >
            {/* LEFT SIDE */}
            <Grid item xs={12} sm={8}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
                alignItems={{ xs: "flex-start", sm: "center" }} 
              >
                {/* Order Number Bubble */}
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: "#FFFFFF",
                    borderRadius: "100px",
                    minWidth: "120px",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  <Typography variant="body2" >
                    Order - {orderSummary.orderNum}
                  </Typography>
                </Box>

                <Typography fontSize={{ xs: "0.85rem", sm: "1rem" }}
                                        sx={{ mt: { xs: 1, sm: 0 } }}
>
                  Order Placed{" "}
                  {new Intl.DateTimeFormat("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(orderSummary.placedOn))}
                </Typography>
              </Box>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid item xs={12} sm={4} textAlign={{ xs: "left", sm: "right" }}>
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
                  backgroundColor: "#0AA44F",
                  color: "#fff",
                  fontWeight: 400,
                  fontSize: "14px",
                  width: { xs: "100%", sm: "auto" },
                  textTransform: "none",
                  py: 0.5,
                }}
                onClick={handleTicketRaise}
              >
                Raise Ticket
              </Button>
            </Grid>
          </Grid>

          {orderSummary.productCards?.map((item, idx) => (
            <Grid
              container
              spacing={2}
              mb={2}
              key={idx}
              px={2}
              alignItems="center" // vertically center
              wrap="nowrap" // prevent wrapping to next line
            >
              <Grid item xs="auto">
                <Link to={`/product/${item.itemSlug}`} className="router-link">
                  <img
                    src={item.itemImage}
                    alt={item.itemTitle}
                    width="100%"
                    style={{ maxWidth: "100px", borderRadius: 8 }}
                  />
                </Link>
              </Grid>

              <Grid item xs>
                <Link to={`/product/${item.itemSlug}`} className="router-link">
                  <Typography variant="body2">{item.itemTitle}</Typography>
                </Link>
                <Typography fontWeight="bold" mt={1}>
                  ₹{item.itemPrice}
                </Typography>
              </Grid>
            </Grid>
          ))}

          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pl={2}
            py={1}
            flexWrap="wrap"
            gap={1}
          >
            {/* Left Side */}
            <Box>
              {orderSummary.orderStatus === OrderStatus.PENDING ? (
                <Button
                  startIcon={<CancelOutlinedIcon />}
                  sx={{
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: (theme) => theme.palette.success.light,
                  }}
                  onClick={() => handleOpenCancelDialog(orderSummary.id)}
                >
                  Cancel Order
                </Button>
              ) : (
                <Button
                  startIcon={<ReceiptIcon />}
                  variant="text"
                  sx={{
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  View Invoice
                </Button>
              )}
            </Box>

            <Box display="flex" gap={1} pr={2}>
              {orderSummary.orderStatus === OrderStatus.DELIVERED && (
                <Button
                  sx={{
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: (theme) => theme.palette.success.light,
                  }}
                  onClick={() => handleReturnClick(orderSummary.orderNum)}
                >
                  <img
                    src={ReturnIcon}
                    alt="Return"
                    style={{ marginRight: "5px" }}
                  />
                  Return
                </Button>
              )}
            </Box>
          </Box>
        </Card>
      )}

{ orderSummary && orderSummary.orderNum && 
(

  <RaiseTicketForm
    open={isRaiseTicketeDrawerOpen}
    orderNum={orderSummary.orderNum}
    onClose={() => {
      setIsRaiseTicketeDrawerOpen(false);
      dispatch(addSticky());
    }}
  />
)
}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <CancelOrderDialog
        open={cOpen}
        onClose={() => setCOpen(false)}
        onConfirm={handleCancel}
      />
    </Box>
  );
};

export default TrackOrdersPage;
