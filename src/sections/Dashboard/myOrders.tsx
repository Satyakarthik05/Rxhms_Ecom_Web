import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  IconButton,
  Button,
  Card,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Link, useNavigate } from "react-router-dom";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { OrderMaster } from "../myCart/model/orderMaster";
import {
  AddOrderRatingUri,
  CancelOrderUri,
  GetCustomerDetailsUri,
  getCustomerOrdersFilteredUri,
  getCustomerOrdersSearchUri,
  OrdersUri,
} from "./profileService/profileService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store/store";
import { OrderStatus } from "../myCart/model/orderStatus";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";
import CancelOrderDialog from "./cancelOrderDialog";
import { usePostByBody } from "../../customHooks/usePostByBody";
import { OrderCancellation } from "../myCart/model/orderCancellation";
import { CancelledByType } from "../myCart/model/cancelledByType";
import ReturnIcon from "../../assets/media/icons/Return.svg";
import { OrderItems } from "../myCart/model/orderItems";
import { Rate } from "antd";
import { Customer } from "../register/model/customer";
import OrderFilterDrawer from "./orderFilterDrawer";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import { PageState, setLocalText } from "../../web-constants/constants";
import { usePostByParams } from "../../customHooks/usePostByParams";
import OrderReviewDrawer from "./orderReviewDrawer";
import NoOrdersFound from "../../utils/noOrdersFound";
import ClearIcon from "@mui/icons-material/Clear";
import { ReactComponent as DcumentIcon } from "../../assets/media/icons/docgreen.svg";
import PaymentStatusIndicator from "../../utils/paymentStatusIndicator";
import { PaymentStatus } from "../myCart/model/paymentStatus";
import OrderStatusChip from "./orderStatusChip";
import PaymentRetry from "../../utils/paymentRetry";
import { selectCurrencySymbol } from "../../Redux/slices/currencySlice";

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const username = useSelector((store: RootState) => store.jwtToken.username);
  const { DAYS: days } = useSelector((store: RootState) => store.returnTerm);
  const [pageStatus, setPageStatus] = useState<PageState>(PageState.IDLE);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("md")); // true for md and above (≥900px)

  console.log("days", days);
  // const {
  //   data: initialOrders,
  //   isLoading,
  //   error,
  //   fetchData,
  // } = useFetchByQuery<OrderMaster[]>(OrdersUri, { username });
  const {
    data: initialOrders,
    isLoading,
    error,
    fetchData,
  } = useFetchByQuery<OrderMaster[]>(getCustomerOrdersFilteredUri(username), {
    status: null,
    filterType: "DAY",
    filterValue: 30,
  });

  const [searchKey, setSearchKey] = useState<string>("");
  const { ENABLE_RETRY_PAYMENT_MINUTES: minutes } = useSelector(
    (store: RootState) => store.retryPaymentTerm
  );

  const [selectedDateLabel, setSelectedDateLabel] =
    useState<string>("Last 30 Days");

  console.log("##$code ENABLE_RETRY_PAYMENT_MINUTES", minutes);

  const { data: ordersSearch } = useFetchByQuery<OrderMaster[]>(
    getCustomerOrdersSearchUri,
    { username, searchKey }
  );
  console.log("ordersSearch", ordersSearch);

  const { data: customerData } = useFetchByQuery<Customer[]>(
    GetCustomerDetailsUri,
    { username }
  );
  const [filterDrawerKey, setFilterDrawerKey] = useState(0);
  const [orderId, setOrderId] = useState<number | null>(null);

  console.log("customerData", customerData);

  const { executePost: executeRatingPost } = usePostByParams<OrderMaster>();
  const [rating, setRating] = useState<number>(0);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [reviewDrawer, setReviewDrawer] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [orders, setOrders] = useState<OrderMaster[]>([]);
  const [cOpen, setCOpen] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { executePost } = usePostByBody<any>();
  console.log("initialOrders", initialOrders);
  const dispatch = useDispatch<AppDispatch>();
  const symbol = useSelector(selectCurrencySymbol);

  const initialOrdersRef = useRef<OrderMaster[]>(null);

  useEffect(() => {
    if (initialOrders) {
      const sortedOrders = [...initialOrders].sort((a, b) => b.id - a.id);
      initialOrdersRef.current = initialOrders;
      setOrders(sortedOrders);
    }
  }, [initialOrders]);

  const handleOpenCancelDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  console.log("@@@initialOrdersRef", initialOrdersRef);
  console.log("@@@orders", orders);

  const handleRatingChange = async (value: number, orderNum: string) => {
    console.log("Rating changed:", value);
    setRating(value);

    try {
      const response: any = await executeRatingPost(AddOrderRatingUri, {
        orderNum,
        rating: value,
      });

      console.log("Rating submission response:", response);

      if (response) {
        setSnackbarMessage("Rating submitted successfully.");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarSeverity("error");
      }
    } catch (err) {
      console.error("Rating submission failed", err);
      setSnackbarMessage("Failed to submit rating. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
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
      fetchData(true, OrdersUri, { username });
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

  const handleTrackPageClick = (orderNum: string) => {
    navigate(`/order-details/${orderNum}`);
  };
  const handleReturnClick = (orderNum: string) => {
    navigate(`/return-order/${orderNum}`);
  };

  const handleDateFilter = () => {
    setIsFilterDrawerOpen(true);
    dispatch(removeSticky());
  };

  //   useEffect(() => {
  //   if (username) {
  //     handleApplyFilters({
  //       status: null,
  //       filterType: "DAY",
  //       filterValue: 30,
  //     });
  //   }
  // }, [username]);

  const handleApplyFilters = async (filterParams: Record<string, any>) => {
    if (fetchData) {
      const { selectedDateLabel: label, ...apiFilterParams } = filterParams;

      setSelectedDateLabel(label || "");
      setOrders([]);
      setIsSearch(false);
      setSearchKey("");
      setPageStatus(PageState.LOADING);
      const filteredOrders: any = await fetchData(
        true,
        getCustomerOrdersFilteredUri(username),
        apiFilterParams
      );

      console.log("@@@filteredOrders", filteredOrders);

      if (filteredOrders?.length > 0) {
        setPageStatus(PageState.SUCCESS);
        const sorted = [...(filteredOrders as OrderMaster[])].sort(
          (a, b) => b.id - a.id
        );
        setOrders(sorted);
      } else {
        setPageStatus(PageState.ERROR);
      }
    }
  };

  const handleClearFilters = () => {
    if (fetchData) {
      fetchData(true, getCustomerOrdersFilteredUri(username), {
        status: null,
        filterType: "DAY",
        filterValue: 30,
      });
    }
  };

  useEffect(() => {
    if (ordersSearch) {
      const sorted = [...ordersSearch].sort((a, b) => b.id - a.id);
      setOrders(sorted);
    }
  }, [ordersSearch]);

  const handleSearchOrders = async () => {
    if (!fetchData) return;

    const trimmedKey = searchKey.trim();

    if (!/^[a-zA-Z0-9\s]{3,}$/.test(trimmedKey)) {
      setSnackbarMessage(
        "Please enter at least 3 characters (letters or numbers)."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const params = { username, searchKey: trimmedKey };
    try {
      const filteredOrders: any = await fetchData(
        true,
        getCustomerOrdersSearchUri,
        params
      );
      console.log("###filteredOrders", filteredOrders);

      if (Array.isArray(filteredOrders) && filteredOrders.length > 0) {
        const sorted = [...filteredOrders].sort((a, b) => b.id - a.id);
        setOrders(sorted);
      } else {
        setOrders([]);
      }

      setIsSearch(true);
    } catch (err) {
      console.error("Search failed", err);
      setSnackbarMessage("Search failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setOrders([]);
    }
  };

  if (isLoading)
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  console.log("error", error);
  console.log("!isSearch", !isSearch);

  const handleDownloadInvoice = (invoiceUrl?: string) => {
    if (!invoiceUrl) {
      console.error("Invoice URL is not available.");
      return;
    }
    const link = document.createElement("a");
    link.href = invoiceUrl;
    link.setAttribute("download", "invoice.pdf");
    window.open(invoiceUrl, "_blank");
    document.body.appendChild(link);
    // link.click();
    document.body.removeChild(link);
  };

  const handleClearAndFetchOrders = async () => {
    setSearchKey("");
    setIsSearch(false);

    if (fetchData) {
      const refreshedOrders: any = await fetchData(true, OrdersUri, {
        username,
      });
      if (Array.isArray(refreshedOrders)) {
        const sorted = [...refreshedOrders].sort((a, b) => b.id - a.id);
        setOrders(sorted);
      }
    }
  };

  const handleReryPayment = (orderNum: string) => {
    setLocalText("orderNum", orderNum);
    setTimeout(() => {
      navigate("/cart/bag/checkout", {
        state: { retryPayment: true },
      });
    }, 10);
  };

  const isRetry = (date: string, minutes: number): boolean => {
    if (!minutes) return false;

    const orderedDate = new Date(
      date.endsWith("Z") ? date : date + "Z"
    ).getTime();
    const retryDeadline = orderedDate + minutes * 60_000;

    return retryDeadline < Date.now();
  };

  // const isReturn = (date: string, days: string) => {
  //   if (!days) return false;

  //   const orderedDate = new Date(
  //     date.endsWith("Z") ? date : date + "Z"
  //   ).getTime();
  //   const returnDeadline = orderedDate + parseInt(days) * 24 * 60 * 60 * 1000;

  //   return returnDeadline < Date.now();
  // };

  return (
    <Box
      sx={{
        maxWidth: "1100px",
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <>
        <Grid container spacing={2} alignItems="center" mb={2}>
          {/* Title */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontSize={{ xs: "1.2rem", sm: "1.5rem" }}
            >
              My Orders ({orders.length})
            </Typography>

            {selectedDateLabel && (
              <Typography
                variant="body2"
                fontWeight="medium"
                color="text.secondary"
                mt={0.5}
              >
                {selectedDateLabel}
              </Typography>
            )}
          </Grid>

          {/* Search + Filter */}
          <Grid item xs={12} sm={6}>
            <Grid
              container
              spacing={1}
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
            >
              {/* Search Field - 8 columns on mobile */}
              <Grid item xs={8}>
                <TextField
                  value={searchKey}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^[a-zA-Z0-9\s]*$/.test(inputValue)) {
                      setSearchKey(inputValue);
                    }
                    if (inputValue.trim() === "") {
                      handleClearAndFetchOrders();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchOrders();
                    }
                  }}
                  variant="outlined"
                  size="small"
                  placeholder="Search for items"
                  fullWidth
                  sx={{
                    backgroundColor: "#f2ebe5",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton onClick={handleSearchOrders}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: searchKey && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={async () => {
                            setSearchKey("");
                            setIsSearch(false);
                            if (fetchData) {
                              const refreshedOrders: any = await fetchData(
                                true,
                                getCustomerOrdersFilteredUri(username),
                                {
                                  status: null,
                                  filterType: "DAY",
                                  filterValue: 30,
                                }
                              );
                              if (Array.isArray(refreshedOrders)) {
                                const sorted = [...refreshedOrders].sort(
                                  (a, b) => b.id - a.id
                                );
                                setOrders(sorted);
                              }
                            }
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Filters Button - 4 columns on mobile */}
              <Grid item xs={4}>
                <Button
                  variant="outlined"
                  endIcon={<FilterListIcon />}
                  onClick={handleDateFilter}
                  fullWidth
                  sx={{
                    height: 40,
                    borderRadius: "8px",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Filters
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* old New Orders */}

        {!isSearch &&
          orders &&
          pageStatus !== PageState.LOADING &&
          orders.length > 0 &&
          Array.isArray(orders) &&
          orders?.map((order) => {
            console.log("@@order.paymentStatus", order.paymentStatus);

            return (
              <Card
                key={order.id}
                variant="outlined"
                sx={{ mb: 2, borderColor: (theme) => theme.palette.info.main }}
              >
                <Box
                  display="flex"
                  flexDirection={{ xs: "row", sm: "row" }}
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    backgroundColor: (theme) => theme.palette.info.main,
                    px: { xs: 1, sm: 3 },
                    py: { xs: 1.3, sm: 2 },
                  }}
                >
                  {/* LEFT SIDE */}
                  <Box flex={1} sx={{ mb: { xs: 0, sm: 0 }, mr: { sm: 2 } }}>
                    <Box
                      display="flex"
                      flexDirection={{
                        xs: "column",
                        sm: "row",
                        md: "row",
                        lg: "row",
                      }}
                      gap={2}
                      alignItems={{ xs: "flex-start", md: "center" }}
                      justifyContent={{ xs: "flex-start", md: "flex-start" }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          backgroundColor: "#FFFFFF",
                          borderRadius: "100px",
                          minWidth: "100px",
                          textAlign: "center",
                          fontSize: "14px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontSize={{ xs: "0.6rem", sm: "14px" }}
                        >
                          Ord No:{order.orderNum}
                        </Typography>
                      </Box>

                      <Typography
                        className="d-none d-md-block"
                        fontSize={{ xs: "0.85rem", sm: "1rem" }}
                        sx={{ mt: { xs: 0.5, md: 0 } }}
                      >
                        Order Placed{" "}
                        {new Intl.DateTimeFormat("en-GB", {
                          weekday: "short",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(order.placedOn))}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    textAlign={{
                      xs: "left",
                      sm: "right",
                    }}
                    sx={{
                      padding: { xs: 0, md: "auto" },
                      m: { xs: 0 },
                    }}
                  >
                    <OrderStatusChip
                      status={order.orderStatus as OrderStatus}
                    />
                  </Box>
                </Box>

                <Grid sx={{ p: { xs: 2, sm: 3 } }}>
                  {order.orderItems.length > 0 && (
                    <Box
                      key={order.orderItems[0].id}
                      display="flex"
                      gap={2}
                      alignItems="flex-start"
                    >
                      <Box
                        component="img"
                        src={order.orderItems[0].productCard?.itemImage}
                        alt={order.orderItems[0].productCard?.itemTitle}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (order.orderStatus === OrderStatus.DELIVERED) {
                            navigate(`/product/ratings/${order.orderNum}`);
                          } else if (
                            order.orderStatus ===
                              OrderStatus.RETURN_IN_PROGRESS ||
                            order.orderStatus === OrderStatus.COMPLETED
                          ) {
                            navigate(`/order-return/${order.orderNum}`);
                          } else {
                            navigate(`/order-details/${order.orderNum}`);
                            // handleTrackPageClick(order.orderNum);
                          }
                        }}
                      />
                      {/* Wrap the following in a single parent element */}
                      <Box sx={{ flex: 1 }}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            {order.orderItems.length > 0 &&
                              order.orderStatus !== OrderStatus.DELIVERED && (
                                <>
                                  {/* Clickable title only */}
                                  <Box
                                    sx={{
                                      cursor: "pointer",
                                      display: "inline-block",
                                      "&:hover": {
                                        textDecoration: "underline",
                                      },
                                    }}
                                    onClick={() => {
                                      if (
                                        order.orderStatus ===
                                        OrderStatus.DELIVERED
                                      ) {
                                        navigate(
                                          `/product/ratings/${order.orderNum}`
                                        );
                                      } else if (
                                        order.orderStatus ===
                                          OrderStatus.RETURN_IN_PROGRESS ||
                                        order.orderStatus ===
                                          OrderStatus.COMPLETED
                                      ) {
                                        navigate(
                                          `/order-return/${order.orderNum}`
                                        );
                                      } else {
                                        navigate(
                                          `/order-details/${order.orderNum}`
                                        );
                                      }
                                    }}
                                  >
                                    <Typography
                                      fontWeight={500}
                                      fontSize="14px"
                                      sx={{ textWrap: "nowrap" }}
                                    >
                                      {isTablet &&
                                        order.orderItems[0].productCard
                                          ?.itemTitle}

                                      {!isTablet &&
                                        order.orderItems[0].productCard
                                          ?.itemTitle.length > 25 &&
                                        `
                                      ${order.orderItems[0].productCard?.itemTitle.slice(
                                        0,
                                        26
                                      )}...
                                      `}
                                      {!isTablet &&
                                        order.orderItems[0].productCard
                                          ?.itemTitle.length < 25 &&
                                        order.orderItems[0].productCard
                                          ?.itemTitle}
                                      {order.orderItems.length > 1 && (
                                        <Typography
                                          component="span"
                                          color="text.secondary"
                                          fontSize="13px"
                                          sx={{ ml: 1, whiteSpace: "wrap" }}
                                        >
                                          + More {order.orderItems.length - 1}{" "}
                                          Products
                                        </Typography>
                                      )}
                                    </Typography>
                                  </Box>

                                  {/* Separate Price - not clickable or hoverable */}
                                  <Typography
                                    fontSize="13px"
                                    mt={0.5}
                                    fontWeight={800}
                                  >
                                    <Box component={"span"} fontWeight={500}>
                                      Total Order Price :
                                    </Box>{" "}
                                    <Typography
                                      component="span"
                                      sx={{
                                        fontSize: "1.0rem",
                                        fontWeight: 500,
                                        color: "#2c3e50",
                                      }}
                                    >
                                      {symbol}
                                      {"\u200A"}
                                      {order.finalPrice}
                                    </Typography>
                                  </Typography>
                                </>
                              )}
                          </Grid>

                          {order.orderStatus === OrderStatus.DELIVERED && (
                            <>
                              <Grid item sx={{ pt: "0 !important" }} xs={12}>
                                <Box
                                  component={Link}
                                  sx={{
                                    color: (theme) =>
                                      theme.palette.success.main,
                                    textDecoration: "none",
                                    "&:hover": {
                                      textDecoration: "underline",
                                    },
                                  }}
                                  to={`/product/ratings/${order.orderNum}`}
                                >
                                  <Typography
                                    fontSize="14px"
                                    sx={{ mb: 0.3 }}
                                    fontWeight={500}
                                  >
                                    Delivered on May 17, 2025
                                    {order.orderItems.length > 1 &&
                                      `, ${
                                        order.orderItems.length - 1
                                      } More products...`}
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item xs={12} sx={{ pt: "0 !important" }}>
                                <Box key={order.id}>
                                  <Rate
                                    className={`custom-rate ${
                                      order.orderRating ? "disable-hover" : ""
                                    }`}
                                    value={order.orderRating || rating}
                                    disabled={
                                      order.orderRating !== null &&
                                      order.orderRating !== 0
                                    }
                                    onChange={(newValue) =>
                                      handleRatingChange(
                                        newValue,
                                        order.orderNum
                                      )
                                    }
                                  />
                                </Box>
                              </Grid>

                              {!order.isReviewed && (
                                <Grid item xs={12} sx={{ pt: "0 !important" }}>
                                  <Button
                                    sx={{
                                      color: "red",
                                      fontSize: "14px",
                                      py: 0,
                                      textAlign: "left",
                                      textTransform: "none",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() => {
                                      setReviewDrawer(true);
                                      setOrderId(order.id);

                                      dispatch(removeSticky());
                                    }}
                                  >
                                    Write a Review
                                  </Button>
                                </Grid>
                              )}

                              {order && typeof order.id === "number" && (
                                <OrderReviewDrawer
                                  open={reviewDrawer}
                                  orderId={orderId}
                                  productId={0}
                                  setOrders={setOrders}
                                  orders={orders}
                                  onClose={() => {
                                    setReviewDrawer(false);
                                    dispatch(addSticky());
                                  }}
                                  onReviewSubmitted={() => {
                                    console.log("Review submitted!");
                                    setReviewDrawer(false);
                                    dispatch(addSticky());
                                  }}
                                />
                              )}
                            </>
                          )}
                        </Grid>
                        {order.orderStatus !== OrderStatus.DELIVERED && (
                          <Box
                            sx={{
                              pt: {
                                xs: 0,
                                sm: 1.4,
                              },
                            }}
                          >
                            <PaymentStatusIndicator
                              status={order.paymentStatus as PaymentStatus}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {order.orderStatus !== OrderStatus.CANCELLED &&
                    order.paymentStatus !== PaymentStatus.FAILED &&
                    order.paymentStatus !== PaymentStatus.PENDING && (
                      <Divider
                        sx={{
                          my: 2,
                          borderColor: "#F1EAE4",
                          borderBottomWidth: "3px",
                        }}
                      />
                    )}
                  {order.paymentStatus !== PaymentStatus.FAILED &&
                    order.paymentStatus !== PaymentStatus.PENDING && (
                      <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems="center"
                        gap={1}
                      >
                        <Box className="d-flex w-100 flex-row justify-content-between align-items-center">
                          {order.orderStatus === OrderStatus.ORDER_PLACED ||
                          order.orderStatus === OrderStatus.PROCESSING ? (
                            // Cancel Order Button
                            <Button
                              startIcon={<CancelOutlinedIcon />}
                              sx={{
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: (theme) => theme.palette.success.light,
                                width: { xs: "100%", sm: "auto" },
                                py: 0.5,
                              }}
                              onClick={() => handleOpenCancelDialog(order.id)}
                            >
                              Cancel Order
                            </Button>
                          ) : order.orderStatus === OrderStatus.DELIVERED ? (
                            <Button
                              startIcon={
                                <Box
                                  component={DcumentIcon}
                                  sx={{ width: 18, height: 18 }}
                                />
                              }
                              sx={{
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: (theme) => theme.palette.success.light,
                                width: { xs: "100%", sm: "auto" },
                                py: 0.5,
                              }}
                              onClick={() =>
                                handleDownloadInvoice(order.invoiceUrl)
                              }
                            >
                              Invoice
                            </Button>
                          ) : (
                            <Box sx={{ width: { xs: "100%", sm: "auto" } }} />
                          )}

                          <Box
                            display="flex"
                            flexDirection={{ xs: "column", sm: "row" }}
                            gap={1}
                            width={{ xs: "100%", sm: "auto" }}
                          >
                            {order.orderStatus === OrderStatus.DELIVERED && (
                              <Button
                                sx={{
                                  textTransform: "none",
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: (theme) => theme.palette.success.light,
                                  py: 0.5,
                                }}
                                onClick={() =>
                                  handleReturnClick(order.orderNum)
                                }
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

                        {order.orderStatus !== OrderStatus.CANCELLED && (
                          <Button
                            startIcon={<LocationSearchingOutlinedIcon />}
                            sx={{
                              backgroundColor: "#0AA44F",
                              color: "#fff",
                              fontWeight: 400,
                              textWrap: "nowrap",
                              fontSize: "14px",
                              width: { xs: "100%", sm: "auto" },
                              textTransform: "none",
                              py: 0.5,
                              px: "20px !important",
                            }}
                            onClick={() => handleTrackPageClick(order.orderNum)}
                          >
                            Track Order
                          </Button>
                        )}
                      </Box>
                    )}
                  {((minutes && order.paymentStatus === PaymentStatus.FAILED) ||
                    (minutes &&
                      order.paymentStatus === PaymentStatus.PENDING)) && (
                    <>
                      {isRetry(order.placedOn, parseInt(minutes)) && (
                        <PaymentRetry
                          orderNum={order.orderNum}
                          placedOn={order.placedOn}
                          expiredOn={
                            order?.retryPaymentTime
                              ? order.retryPaymentTime
                              : ""
                          }
                        />
                      )}
                    </>
                  )}
                </Grid>
              </Card>
            );
          })}

        <Container
          sx={{
            maxWidth: "1100px",
            mx: "auto",
            px: { xs: 1, sm: 2, md: 3 },
            py: 2,
          }}
        >
          {isSearch &&
            pageStatus !== PageState.LOADING &&
            orders?.map((order: OrderMaster) => (
              <Box
                key={order.id}
                sx={{
                  borderRadius: 2,
                  border: "1px solid #eee",
                  mb: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                {/* Order Header */}
                <Box
                  display="flex"
                  flexDirection={{ xs: "row", sm: "row" }}
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    backgroundColor: (theme) => theme.palette.info.main,
                    px: { xs: 1, sm: 3 },
                    py: { xs: 1.3, sm: 2 },
                  }}
                >
                  {/* LEFT SIDE */}
                  <Box flex={1} sx={{ mb: { xs: 0, sm: 0 }, mr: { sm: 2 } }}>
                    <Box
                      display="flex"
                      flexDirection={{
                        xs: "column",
                        sm: "row",
                        md: "row",
                        lg: "row",
                      }}
                      gap={2}
                      alignItems={{ xs: "flex-start", md: "center" }}
                      justifyContent={{ xs: "flex-start", md: "flex-start" }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          backgroundColor: "#FFFFFF",
                          borderRadius: "100px",
                          minWidth: "100px",
                          textAlign: "center",
                          fontSize: "14px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontSize={{ xs: "0.6rem", sm: "14px" }}
                        >
                          Ord No:{order.orderNum}
                        </Typography>
                      </Box>

                      <Typography
                        className="d-none d-md-block"
                        fontSize={{ xs: "0.85rem", sm: "1rem" }}
                        sx={{ mt: { xs: 0.5, md: 0 } }}
                      >
                        Order Placed{" "}
                        {new Intl.DateTimeFormat("en-GB", {
                          weekday: "short",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(order.placedOn))}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    textAlign={{
                      xs: "left",
                      sm: "right",
                    }}
                    sx={{
                      padding: { xs: 0, md: "auto" },
                      m: { xs: 0 },
                    }}
                  >
                    <OrderStatusChip
                      status={order.orderStatus as OrderStatus}
                    />
                  </Box>
                </Box>

                {/* Order Items */}
                <Box px={{ xs: 1.5, sm: 2 }} py={1.5}>
                  {order.orderItems?.map((item: OrderItems, index: number) => (
                    <Box
                      key={item.id}
                      display="flex"
                      gap={2}
                      py={1.5}
                      alignItems="flex-start"
                      sx={{
                        borderBottom:
                          index !== order.orderItems.length - 1
                            ? "1px dashed #F1EAE4"
                            : "none",
                        flexDirection: { sm: "row" },
                      }}
                    >
                      <Box
                        component="img"
                        src={item.productCard?.itemImage}
                        alt={item.productCard?.itemTitle}
                        sx={{
                          width: { xs: 56, sm: 64 },
                          height: { xs: 56, sm: 64 },
                          borderRadius: 1,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />

                      <Box flex={1}>
                        {/* Title (clickable) */}
                        <Box
                          sx={{
                            cursor: "pointer",
                            display: "inline-block",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() => {
                            if (order.orderStatus === OrderStatus.DELIVERED) {
                              navigate(`/product/ratings/${order.orderNum}`);
                            } else if (
                              order.orderStatus ===
                                OrderStatus.RETURN_IN_PROGRESS ||
                              order.orderStatus === OrderStatus.COMPLETED
                            ) {
                              navigate(`/order-return/${order.orderNum}`);
                            } else {
                              navigate(`/order-details/${order.orderNum}`);
                            }
                          }}
                        >
                          <Typography
                            fontWeight={500}
                            fontSize={{ xs: "13px", sm: "14px" }}
                            mb={0.5}
                          >
                            {item.productCard?.itemTitle}
                          </Typography>
                        </Box>

                        {/* Price section */}
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            fontSize={{ xs: "12px", sm: "13px", md: "14px" }}
                            color="text.disabled"
                            sx={{
                              textDecoration: "line-through",
                              fontWeight: 400,
                            }}
                          >
                            {symbol}
                            {"\u200A"}
                            {item.productCard?.itemMrp}
                          </Typography>

                          <Typography
                            fontSize={{ xs: "13px", sm: "14px", md: "16px" }}
                            color="primary"
                            fontWeight={600}
                          >
                            {symbol}
                            {"\u200A"}
                            {item.productCard?.itemPrice}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}

                  {/* Total Price */}
                  {/* {order.orderStatus !== OrderStatus.DELIVERED && (
                    <Box mt={2}>
                      <Typography fontSize="13px" fontWeight={800}>
                        <Box component="span" fontWeight={500}>
                          Total Order Price:
                        </Box>{" "}
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: "#2c3e50",
                          }}
                        >
                          {symbol}
                          {"\u200A"}
                          {order.finalPrice}
                        </Typography>
                      </Typography>
                    </Box>
                  )} */}
                </Box>

                {/* Bottom Actions */}
                {order.orderStatus !== OrderStatus.CANCELLED &&
                  order.paymentStatus !== PaymentStatus.FAILED &&
                  order.paymentStatus !== PaymentStatus.PENDING && (
                    <Divider
                      sx={{
                        my: 2,
                        borderColor: "#F1EAE4",
                        borderBottomWidth: "3px",
                      }}
                    />
                  )}

                {order.paymentStatus !== PaymentStatus.FAILED &&
                  order.paymentStatus !== PaymentStatus.PENDING && (
                    <Box
                      display="flex"
                      flexDirection={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems="center"
                      gap={1}
                      px={2}
                      pb={2}
                    >
                      <Box className="d-flex w-100 flex-row justify-content-between align-items-center">
                        {order.orderStatus === OrderStatus.ORDER_PLACED ||
                        order.orderStatus === OrderStatus.PROCESSING ? (
                          <Button
                            startIcon={<CancelOutlinedIcon />}
                            sx={{
                              textTransform: "none",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: (theme) => theme.palette.success.light,
                              width: { xs: "100%", sm: "auto" },
                              py: 0.5,
                            }}
                            onClick={() => handleOpenCancelDialog(order.id)}
                          >
                            Cancel Order
                          </Button>
                        ) : order.orderStatus === OrderStatus.DELIVERED ? (
                          <Button
                            startIcon={
                              <Box
                                component={DcumentIcon}
                                sx={{ width: 18, height: 18 }}
                              />
                            }
                            sx={{
                              textTransform: "none",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: (theme) => theme.palette.success.light,
                              width: { xs: "100%", sm: "auto" },
                              py: 0.5,
                            }}
                            onClick={() =>
                              handleDownloadInvoice(order.invoiceUrl)
                            }
                          >
                            Invoice
                          </Button>
                        ) : (
                          <Box sx={{ width: { xs: "100%", sm: "auto" } }} />
                        )}

                        <Box
                          display="flex"
                          flexDirection={{ xs: "column", sm: "row" }}
                          gap={1}
                          width={{ xs: "100%", sm: "auto" }}
                        >
                          {order.orderStatus === OrderStatus.DELIVERED && (
                            <Button
                              sx={{
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: (theme) => theme.palette.success.light,
                                py: 0.5,
                              }}
                              onClick={() => handleReturnClick(order.orderNum)}
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

                      {order.orderStatus !== OrderStatus.CANCELLED && (
                        <Button
                          startIcon={<LocationSearchingOutlinedIcon />}
                          sx={{
                            backgroundColor: "#0AA44F",
                            color: "#fff",
                            fontWeight: 400,
                            textWrap: "nowrap",
                            fontSize: "14px",
                            width: { xs: "100%", sm: "auto" },
                            textTransform: "none",
                            py: 0.5,
                            px: "20px !important",
                          }}
                          onClick={() => handleTrackPageClick(order.orderNum)}
                        >
                          Track Order
                        </Button>
                      )}
                    </Box>
                  )}

                {((minutes && order.paymentStatus === PaymentStatus.FAILED) ||
                  (minutes &&
                    order.paymentStatus === PaymentStatus.PENDING)) && (
                  <>
                    {isRetry(order.placedOn, parseInt(minutes)) && (
                      <Box px={2} pb={2}>
                        <PaymentRetry
                          orderNum={order.orderNum}
                          placedOn={order.placedOn}
                          expiredOn={order?.retryPaymentTime ?? ""}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
            ))}
        </Container>

        {pageStatus === PageState.LOADING && (
          <Box
            sx={{
              height: "65vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {orders.length === 0 && (
          <NoOrdersFound
            message={
              isSearch || filterDrawerKey
                ? "No matching orders found"
                : "No orders found"
            }
            buttonLabel={isSearch || filterDrawerKey ? "Get Orders" : ""}
            onButtonClick={
              isSearch || filterDrawerKey
                ? async () => {
                    setIsSearch(false);
                    setSearchKey("");
                    setFilterDrawerKey((prev) => prev + 1);

                    if (fetchData) {
                      const refreshedOrders: any = await fetchData(
                        true,
                        getCustomerOrdersFilteredUri(username),
                        {
                          status: null,
                          filterType: "DAY",
                          filterValue: 30,
                        }
                      );
                      if (Array.isArray(refreshedOrders)) {
                        const sorted = [...refreshedOrders].sort(
                          (a, b) => b.id - a.id
                        );
                        setOrders(sorted);
                      }
                    }
                  }
                : undefined
            }
          />
        )}
      </>

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

      <OrderFilterDrawer
        key={filterDrawerKey}
        isOpen={isFilterDrawerOpen}
        onClose={() => {
          setIsFilterDrawerOpen(false);
          dispatch(addSticky());
        }}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </Box>
  );
};

export default MyOrders;
