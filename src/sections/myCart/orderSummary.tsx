import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  Badge,
  Tooltip,
  IconButton,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  clearLocalText,
  getLocalText,
  PageState,
} from "../../web-constants/constants";
import { getOrderResponseService } from "./service/getOrderResponseService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/store/store";
import { clearCart, clearCartItemIds } from "../../Redux/slices/addToCart";
import { OrderResponse } from "./model/orderResponse";
import NotFound from "../../utils/notFound/notFound";
import NotFoundImage from "../../assets/media/images/Empty State-4.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ProductCard } from "../inventoryProduct/model/productCard";
import { paymentMethodMapping } from "./model/paymentMethod";
import { selectCurrencySymbol } from "../../Redux/slices/currencySlice";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const OrderSummary = () => {
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [pageState, setPageState] = useState<PageState>(PageState.IDLE);
  const symbol = useSelector(selectCurrencySymbol);
  const [copied, setCopied] = useState(false);

  const dispath = useDispatch<AppDispatch>();
  console.log("orderNum in summary", orderData);
  const navigate = useNavigate();

  // ,

  const today = new Date();
  const delivery = new Date(today);
  delivery.setDate(today.getDate() + 7);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const deliveryDate = delivery.toLocaleDateString("en-US", options);

  useEffect(() => {
    setPageState(PageState.LOADING);
    dispath(clearCartItemIds());
    const getData = async () => {
      try {
        const localStorageOrderNum = getLocalText("orderNum");
        console.log("local NUM @@@", localStorageOrderNum);
        if (localStorageOrderNum) {
          const response = await getOrderResponseService(localStorageOrderNum);
          setOrderData(response);
          dispath(clearCart());
          setPageState(PageState.SUCCESS);
          clearLocalText("orderNum");
        } else {
          setPageState(PageState.ERROR);
        }
      } catch (err) {
        setPageState(PageState.ERROR);
        console.log("error", err);
      }
    };
    getData();
  }, []);

  // const { data, error, isLoading } = useFetchByQuery(postOrderDetails, {
  //   orderNum: orderNum,
  // });

  const handleCopy = () => {
    navigator.clipboard.writeText(orderData?.orderNum.toString() || "");
    setCopied(true);
  };

  console.log(pageState);

  return (
    <Box>
      {orderData && pageState === PageState.SUCCESS && (
        <Box
          className="container"
          sx={{ margin: 0, padding: { xs: 0, sm: 0, md: 0 } }}
        >
          <Grid container sx={{ padding: { xs: 0, sm: 0, md: 0 } }} spacing={3}>
            {/* Left Section - Address & Payment */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{ position: "sticky", top: 130 }}
                className="px-0 px-md-5"
              >
                <Box sx={{ padding: 2, textAlign: "center" }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: "#12B76A" }} />
                  <Typography variant="h6" fontWeight="bold" mt={1}>
                    Order placed successfully!
                  </Typography>

                  <Typography variant="body2" fontWeight="bold" mt={1}>
                    You will receive an email with order details
                  </Typography>
                  {/* <Typography
                    fontWeight={700}
                    variant="body2"
                    color="textSecondary"
                  >
                    You will receive an email with order details
                  </Typography> */}
                  <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                    Order ID: {orderData.orderNum}
                    <Tooltip title={copied ? "Copied!" : "Copy Order ID"} arrow>
                      <IconButton size="small" onClick={handleCopy}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </Box>
                <Card
                  className="outline"
                  sx={{
                    boxShadow: "none",
                    borderRadius: { xs: "8px", md: "16px" },
                    padding: { sx: 2, md: 5 },
                    border: "1px solid #F1EAE4",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12} md={6} p={{ xs: 1.5, md: 0 }}>
                          <Typography
                            fontWeight="bold"
                            sx={{
                              color: (theme) => theme.palette.success.main,
                            }}
                          >
                            Shipping address
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              pr: { sm: 0, lg: 2 },
                              color: (theme) => theme.palette.text.success,
                            }}
                          >
                            {orderData.shippingAddress.fullName}
                            <br />
                            {`${orderData.shippingAddress.addressLine1} ${orderData.shippingAddress.addressLine2} ${orderData.shippingAddress.city} ${orderData.shippingAddress.state} ${orderData.shippingAddress.country} -${orderData.shippingAddress.postalCode} ph:${orderData.shippingAddress.phoneNumber}`}
                            {/* Flat No. 104, Harmony Heavens Apartments, KPR Colony,
                  Manikonda Hyderabad, Telangana, India - 500089 */}
                          </Typography>
                          <Divider
                            sx={{
                              my: 2,
                              mr: 5,
                              border: "1px solid",
                              borderColor: (theme) => theme.palette.info.main,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} px={{ xs: 1.5, md: 0 }}>
                          <Typography
                            fontWeight="bold"
                            sx={{
                              color: (theme) => theme.palette.success.main,
                            }}
                          >
                            Billing address
                          </Typography>
                          <Typography
                            sx={{
                              color: (theme) => theme.palette.text.success,
                            }}
                            variant="body2"
                            color="textSecondary"
                          >
                            {orderData.billingAddress.fullName}
                            <br />
                            {`${orderData.billingAddress.addressLine1} ${orderData.billingAddress.addressLine2} ${orderData.billingAddress.city} ${orderData.billingAddress.state} ${orderData.billingAddress.country} -${orderData.billingAddress.postalCode} ph:${orderData.billingAddress.phoneNumber}`}
                            {/* Flat No. 104, Harmony Heavens Apartments, KPR Colony,
  Manikonda Hyderabad, Telangana, India - 500089 */}
                          </Typography>

                          <Divider
                            sx={{
                              my: 2,
                              mr: 5,
                              border: "1px solid",
                              borderColor: (theme) => theme.palette.info.main,
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs={12} md={6} px={{ xs: 1.5, md: 0 }}>
                          <Typography fontWeight="bold" mt={1}>
                            Contact information
                          </Typography>
                          <Typography
                            sx={{
                              color: (theme) => theme.palette.text.success,
                            }}
                            variant="body2"
                            color="textSecondary"
                          >
                            {orderData?.customer?.mobileNumber &&
                              orderData?.customer?.mobileNumber}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {orderData?.customer?.emailId &&
                              orderData?.customer?.emailId}
                          </Typography>
                          <Divider
                            sx={{
                              my: 2,
                              mr: 5,
                              border: "1px solid",
                              borderColor: (theme) => theme.palette.info.main,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} px={{ xs: 1.5, md: 0 }}>
                          <Box className="d-flex flex-row justify-content-between">
                            <Box>
                              <Typography fontWeight="bold" mt={1}>
                                Payment information
                              </Typography>
                              <Typography
                                sx={{
                                  color: (theme) => theme.palette.text.success,
                                }}
                                variant="body2"
                                color="textSecondary"
                              >
                                Total Paid
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  color: (theme) => theme.palette.text.success,
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  pt: 1,
                                }}
                                variant="body2"
                                onClick={() =>
                                  window.open(orderData.invoiceUrl, "_blank")
                                }
                              >
                                View Invoice
                              </Typography>

                              <Typography fontWeight="bold" mt={1}>
                                {symbol}{"\u200A"}{orderData.finalPrice}
                              </Typography>
                            </Box>
                          </Box>
                          <Divider
                            sx={{
                              my: 2,
                              mr: 5,
                              border: "1px solid",
                              borderColor: (theme) => theme.palette.info.main,
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs={12} md={6} px={{ xs: 1.5, md: 0 }}>
                          <Typography fontWeight="bold">
                            Payment method
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <CreditCardIcon />
                            <Typography
                              sx={{
                                ml: 0.5,
                                color: (theme) => theme.palette.text.success,
                              }}
                              variant="body2"
                            >
                              {/* VISA ending with 4242 */}
                              {paymentMethodMapping[orderData.paymentMethod]}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6} px={{ xs: 1.5, md: 0 }}>
                          <Typography fontWeight="bold">
                            Estimated Delivery *
                          </Typography>
                          <Typography
                            sx={{
                              color: (theme) => theme.palette.text.success,
                            }}
                            variant="body2"
                            color="textSecondary"
                            mt={1}
                          >
                            Delivery by {deliveryDate}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Divider
                        sx={{
                          border: "1px solid",
                          borderColor: (theme) => theme.palette.info.main,
                        }}
                      />
                      <Box
                        p={{ xs: 1.5, md: 0 }}
                        className=" w-100 d-flex flex-row justify-content-between align-items-center"
                      >
                        <Box>
                          <Link
                            style={{ fontWeight: "600" }}
                            className="router-link"
                            to="/faq"
                          >
                            Need Help?
                          </Link>
                        </Box>
                        <Box>
                          <Button
                            component={Link}
                            to={`/order-details/${orderData.orderNum}`}
                            sx={{
                              mt: 2,
                              width: "100%",
                              backgroundColor: (theme) =>
                                theme.palette.success.light,
                              color: "#fff",
                            }}
                          >
                            Track Order
                          </Button>
                        </Box>
                      </Box>
                    </Grid>

                    {/* <Grid container justifyContent="space-between">
                    <Typography fontWeight="bold">Total Paid</Typography>
                    <Typography fontWeight="bold">
                      {orderData.productCards[0].currency}{" "}
                      {orderData.finalPrice}
                    </Typography>
                  </Grid> */}

                    {/* <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    sx={{ mt: 2, width: 0, backgroundColor: "#8B5A2B" }}
                  >
                    Continue Shopping
                  </Button> */}
                  </Grid>
                </Card>
              </Box>
            </Grid>

            {/* Right Section - Product & Cost */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  border: "none",
                  borderRadius: { xs: "8px", md: "12px" },
                  backgroundColor: (theme) => theme.palette.info.main,
                }}
                variant="outlined"
              >
                <CardContent>
                  {orderData?.productCards?.map(
                    (each: ProductCard, idx: number) => (
                      <Fragment key={each.itemId}>
                        {each.qty !== undefined && each.qty > 1 ? (
                          <Box display="flex" alignItems="center" mb={2}>
                            {/* <Badge
                              sx={{
                                "& .MuiBadge-badge": {
                                  fontSize: "14px",
                                  color: "white", // text color
                                  width: 24,
                                  height: 24,
                                  backgroundColor: (theme) =>
                                    theme.palette.success.light,
                                  minWidth: 0, // remove default min width
                                },
                              }}
                              badgeContent={each.qty}
                            > */}
                            <img
                              src={each.itemImage}
                              alt={each.productTitle}
                              width={80}
                              height={80}
                              style={{ borderRadius: 8 }}
                            />
                            {/* </Badge> */}
                            <Box ml={2}>
                              <Typography variant="body1" fontWeight="bold">
                                {each.itemTitle}
                              </Typography>
                              <Box mt={0.5} display="flex" alignItems="start">
                                <Typography variant="body2" className="me-3">
                                  {symbol}{"\u200A"}
                                  {each.itemPrice * each.qty}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ textDecoration: "line-through" }}
                                >
                                  {symbol}{"\u200A"}{each.itemMrp * each.qty}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {"\u200A"} {"\u200A"}| {each.qty} Qty
                                </Typography>
                              </Box>
                              {/* <Typography variant="body2">
                          {each.itemDiscount}
                        </Typography> */}
                            </Box>
                          </Box>
                        ) : (
                          <Box display="flex" alignItems="center" mb={2}>
                            <img
                              src={each.itemImage}
                              alt={each.productTitle}
                              width={80}
                              height={80}
                              style={{ borderRadius: 8 }}
                            />
                            <Box ml={2}>
                              <Typography variant="body1" fontWeight="bold">
                                {each.itemTitle}
                              </Typography>
                              <Box display="flex" alignItems="start">
                                <Typography variant="body2" className="me-3">
                                  {symbol}{"\u200A"}{each.itemPrice}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ textDecoration: "line-through" }}
                                >
                                  {symbol}{"\u200A"}{each.itemMrp}
                                </Typography>
                              </Box>
                              {/* <Typography variant="body2">
                          {each.itemDiscount}
                        </Typography> */}
                            </Box>
                          </Box>
                        )}
                        {idx !== orderData?.productCards?.length - 2}{" "}
                        <Divider
                          sx={{
                            my: 2,
                            border: "1px solid",
                            borderColor: "#EED9CB",
                          }}
                        />
                      </Fragment>
                    )
                  )}

                  <Divider
                    sx={{
                      my: 2,

                      border: "1px solid",
                      borderColor: (theme) => theme.palette.info.main,
                    }}
                  />

                  <Box mt={{ xs: 1, ms: 0 }} p={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">Total Cost</Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Typography variant="body2">
                          {symbol}{"\u200A"}{orderData.totalMrp}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Shipping Charge</Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Typography variant="body2">
                          {orderData.shippingCharge ? symbol : null}{"\u200A"}
                          {orderData.shippingCharge || "Free"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2">TaxAmount</Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Typography variant="body2">
                          {symbol}{"\u200A"}{orderData?.taxAmount}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Discount</Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Typography variant="body2">
                          {/* {orderData.productCards[0].currency}
                          {orderData.discAmount} */}

                          {orderData?.discAmount ? (
                            <>
                              -{symbol}{"\u200A"}{Math.round(orderData?.discAmount || 0)}
                            </>
                          ) : (
                            <>{symbol}{"\u200A"}0</>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          Additional Discount
                        </Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Typography variant="body2">
                          {/* {orderData.productCards[0].currency}
                          {orderData.discAmount} */}

                          {orderData?.couponDiscAmount ? (
                            <>
                              -{symbol}{"\u200A"}
                              {Math.round(orderData?.couponDiscAmount || 0)}
                            </>
                          ) : (
                            <>{symbol}{"\u200A"}0</>
                          )}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider
                      sx={{
                        my: 1,

                        border: "1px solid",
                        borderColor: (theme) => theme.palette.info.main,
                      }}
                    />
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="h6" fontWeight="bold">
                          Total:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Typography variant="h6" fontWeight="bold">
                          {symbol}{"\u200A"}{orderData.finalPrice}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider
                      sx={{
                        my: 1,

                        border: "1px solid",
                        borderColor: (theme) => theme.palette.info.main,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {pageState === PageState.ERROR && (
        <NotFound
          title="Order Not Found"
          message="We couldn’t find your order. Please check your order number or try again later."
          imageSrc={NotFoundImage}
          buttonText="Back to Shop"
          onButtonClick={() => navigate("/overview/orders")}
        />
      )}
    </Box>
  );
};

export default OrderSummary;
